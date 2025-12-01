// ultimosAcessosUtils.js
import {
  ScanCommand,
  PutItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import * as AWS from "../../awsConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const dynamoDB = AWS.dynamoDB;

/**
 * Registra o acesso de um produto pelo usuário
 * @param {string} usuarioId - ID do usuário
 * @param {string} produtoId - ID do produto acessado
 * @returns {Promise<{success: boolean}>}
 */
export const registrarAcesso = async (usuarioId, produtoId) => {
  try {
    console.log("📝 Registrando acesso:", { usuarioId, produtoId });

    // Verificar se já existe um acesso recente deste produto pelo usuário
    const existingAccess = await buscarAcessoExistente(usuarioId, produtoId);

    if (existingAccess) {
      // Se já existe, apenas atualizar a data
      console.log("⚠️ Acesso já existe, atualizando data...");
      await deleteItemCommand(existingAccess.id);
    }

    // Criar novo registro de acesso
    const acessoId = `${usuarioId}_${produtoId}_${Date.now()}`;
    const dataAtual = new Date().toISOString();

    const acessoItem = {
      id: { S: acessoId },
      usuarioId: { S: String(usuarioId) },
      produtoId: { S: String(produtoId) },
      dataAcesso: { S: dataAtual },
    };

    const putCommand = new PutItemCommand({
      TableName: "ultimos_acessos",
      Item: acessoItem,
    });

    await dynamoDB.send(putCommand);
    console.log("✅ Acesso registrado com sucesso");

    // Limpar acessos antigos (mais de 10 dias)
    await limparAcessosAntigos(usuarioId);

    return { success: true };
  } catch (error) {
    console.error("❌ Erro ao registrar acesso:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Busca se já existe um acesso deste produto pelo usuário
 * @param {string} usuarioId - ID do usuário
 * @param {string} produtoId - ID do produto
 * @returns {Promise<object|null>}
 */
const buscarAcessoExistente = async (usuarioId, produtoId) => {
  try {
    const command = new ScanCommand({
      TableName: "ultimos_acessos",
      FilterExpression: "usuarioId = :usuarioId AND produtoId = :produtoId",
      ExpressionAttributeValues: {
        ":usuarioId": { S: String(usuarioId) },
        ":produtoId": { S: String(produtoId) },
      },
      Limit: 1,
    });

    const data = await dynamoDB.send(command);

    if (data.Items && data.Items.length > 0) {
      return {
        id: data.Items[0].id?.S || null,
        dataAcesso: data.Items[0].dataAcesso?.S || null,
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar acesso existente:", error);
    return null;
  }
};

/**
 * Limpa acessos com mais de 10 dias
 * @param {string} usuarioId - ID do usuário
 * @returns {Promise<{deletedCount: number}>}
 */
export const limparAcessosAntigos = async (usuarioId) => {
  try {
    console.log("🧹 Limpando acessos antigos do usuário:", usuarioId);

    // Calcular data de 10 dias atrás
    const dezDiasAtras = new Date();
    dezDiasAtras.setDate(dezDiasAtras.getDate() - 10);
    const dataLimite = dezDiasAtras.toISOString();

    // Buscar todos os acessos do usuário
    const command = new ScanCommand({
      TableName: "ultimos_acessos",
      FilterExpression: "usuarioId = :usuarioId AND dataAcesso < :dataLimite",
      ExpressionAttributeValues: {
        ":usuarioId": { S: String(usuarioId) },
        ":dataLimite": { S: dataLimite },
      },
    });

    const data = await dynamoDB.send(command);

    if (data.Items && data.Items.length > 0) {
      console.log(`🗑️ Removendo ${data.Items.length} acessos antigos`);

      // Deletar cada item antigo
      for (const item of data.Items) {
        const acessoId = item.id?.S;
        if (acessoId) {
          await deleteItemCommand(acessoId);
        }
      }

      console.log(`✅ ${data.Items.length} acessos antigos removidos`);
      return { deletedCount: data.Items.length };
    }

    console.log("✅ Nenhum acesso antigo para remover");
    return { deletedCount: 0 };
  } catch (error) {
    console.error("❌ Erro ao limpar acessos antigos:", error);
    return { deletedCount: 0 };
  }
};

/**
 * Helper para deletar item
 */
const deleteItemCommand = async (acessoId) => {
  const deleteCommand = new DeleteItemCommand({
    TableName: "ultimos_acessos",
    Key: {
      id: { S: acessoId },
    },
  });

  await dynamoDB.send(deleteCommand);
};

/**
 * Busca os últimos produtos acessados pelo usuário (últimos 10)
 * @param {string} usuarioId - ID do usuário
 * @returns {Promise<Array>}
 */
export const buscarUltimosAcessos = async (usuarioId) => {
  try {
    console.log("🔍 Buscando últimos acessos do usuário:", usuarioId);

    const command = new ScanCommand({
      TableName: "ultimos_acessos",
      FilterExpression: "usuarioId = :usuarioId",
      ExpressionAttributeValues: {
        ":usuarioId": { S: String(usuarioId) },
      },
    });

    const data = await dynamoDB.send(command);

    if (data.Items && data.Items.length > 0) {
      // Mapear e ordenar por data (mais recente primeiro)
      const acessos = data.Items.map((item) => ({
        id: item.id?.S || "",
        produtoId: item.produtoId?.S || "",
        dataAcesso: item.dataAcesso?.S || "",
      }))
        .sort((a, b) => {
          // Ordenar do mais recente para o mais antigo
          return new Date(b.dataAcesso) - new Date(a.dataAcesso);
        })
        .slice(0, 10); // Limitar a 10 produtos

      console.log(`✅ ${acessos.length} acessos encontrados`);
      return acessos;
    }

    console.log("📭 Nenhum acesso encontrado");
    return [];
  } catch (error) {
    console.error("❌ Erro ao buscar últimos acessos:", error);
    return [];
  }
};

/**
 * Busca os produtos completos dos últimos acessos
 * @param {string} usuarioId - ID do usuário
 * @returns {Promise<Array>}
 */
export const buscarProdutosUltimosAcessos = async (usuarioId) => {
  try {
    console.log("🛍️ Buscando produtos dos últimos acessos...");

    // Buscar IDs dos produtos acessados
    const acessos = await buscarUltimosAcessos(usuarioId);

    if (acessos.length === 0) {
      return [];
    }

    // Buscar detalhes completos de cada produto
    const produtos = [];

    for (const acesso of acessos) {
      try {
        const produtoCommand = new ScanCommand({
          TableName: "produtos",
          FilterExpression: "id = :produtoId",
          ExpressionAttributeValues: {
            ":produtoId": { S: acesso.produtoId },
          },
          Limit: 1,
        });

        const produtoData = await dynamoDB.send(produtoCommand);

        if (produtoData.Items && produtoData.Items.length > 0) {
          const item = produtoData.Items[0];
          const preco = parseFloat(item.preco?.N || 0);
          const imagensFlat = item.imagens ? JSON.parse(item.imagens.S) : [];
          const primeiraImagem = imagensFlat.length > 0 ? imagensFlat[0] : "";

          produtos.push({
            id: item.id.S,
            name: item.nome?.S || "Sem nome",
            price: preco,
            installments:
              item.parcelamento?.S ||
              `ou ${Math.ceil(preco / 100)}x de R$ ${(
                preco / Math.ceil(preco / 100)
              ).toFixed(2)}`,
            discount: item.desconto?.S || "-0% OFF",
            image: primeiraImagem || "",
            precoProdutoText: `R$ ${preco.toFixed(2)} à vista`,
            dataAcesso: acesso.dataAcesso,
          });
        }
      } catch (error) {
        console.error(`Erro ao buscar produto ${acesso.produtoId}:`, error);
      }
    }

    console.log(`✅ ${produtos.length} produtos carregados com sucesso`);
    return produtos;
  } catch (error) {
    console.error("❌ Erro ao buscar produtos dos últimos acessos:", error);
    return [];
  }
};

/**
 * Limpa todos os acessos de um usuário
 * @param {string} usuarioId - ID do usuário
 * @returns {Promise<{success: boolean}>}
 */
export const limparTodosAcessos = async (usuarioId) => {
  try {
    console.log("🗑️ Limpando todos os acessos do usuário:", usuarioId);

    const command = new ScanCommand({
      TableName: "ultimos_acessos",
      FilterExpression: "usuarioId = :usuarioId",
      ExpressionAttributeValues: {
        ":usuarioId": { S: String(usuarioId) },
      },
    });

    const data = await dynamoDB.send(command);

    if (data.Items && data.Items.length > 0) {
      for (const item of data.Items) {
        const acessoId = item.id?.S;
        if (acessoId) {
          await deleteItemCommand(acessoId);
        }
      }

      console.log(`✅ ${data.Items.length} acessos removidos`);
      return { success: true, deletedCount: data.Items.length };
    }

    return { success: true, deletedCount: 0 };
  } catch (error) {
    console.error("❌ Erro ao limpar todos os acessos:", error);
    return { success: false, error: error.message };
  }
};