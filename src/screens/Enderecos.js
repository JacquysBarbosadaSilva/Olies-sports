import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScanCommand, PutCommand, DeleteCommand, UpdateCommand  } from "@aws-sdk/lib-dynamodb";
import dynamoDB from "../../awsConfig";
import { SafeAreaView } from "react-native-safe-area-context";

const logo = "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?..."; 

const TABLE_NAME = "enderecos";

// -------------------------------------------------
// ✅ COMPONENTE DO MODAL
// -------------------------------------------------
function CustomModal({ isVisible, title, message, onCancel, onConfirm, confirmText, isAlert }) {
  return (
    <Modal animationType="fade" transparent visible={isVisible} onRequestClose={onCancel}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          {isAlert && (
            <Ionicons
              name={
                title?.includes("Sucesso") || title?.includes("Cadastrado")
                  ? "checkmark-circle"
                  : "warning"
              }
              size={40}
              color={
                title?.includes("Sucesso") || title?.includes("Cadastrado")
                  ? "#001f3f"
                  : "#C4413B"
              }
              style={{ marginBottom: 15 }}
            />
          )}

          <Text style={modalStyles.modalTitle}>{title}</Text>
          <Text style={modalStyles.modalMessage}>{message}</Text>

          <View style={modalStyles.buttonContainer}>
            {!isAlert && (
              <TouchableOpacity
                style={[modalStyles.button]}
                onPress={onCancel}
              >
                <Text style={modalStyles.textCancel}>CANCELAR</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[modalStyles.button, modalStyles.buttonConfirm]}
              onPress={onConfirm}
            >
              <Text style={modalStyles.textConfirm}>{confirmText || "OK"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function EnderecosScreen({ navigation }) {
  const [addresses, setAddresses] = useState([]);

  const [modalEditVisible, setModalEditVisible] = useState(false);
const [enderecoEditando, setEnderecoEditando] = useState(null);

const [cep, setCep] = useState("");
const [rua, setRua] = useState("");
const [bairro, setBairro] = useState("");
const [numero, setNumero] = useState("");
const [ponto_referencia, setPontoReferencia] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const showModal = (config) => {
    setModalConfig(config);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalConfig({});
  };

  const openEditModal = (address) => {
  setEnderecoEditando(address);

  setCep(String(address.id));
  setRua(address.street);
  setBairro(address.bairro);
  setNumero(String(address.numero));
  setPontoReferencia(address.ponto_referencia);

  setModalEditVisible(true);
};

  // ✅ BUSCAR
  const fetchAddresses = async () => {
    try {
      const data = await dynamoDB.send(
        new ScanCommand({ TableName: TABLE_NAME })
      );

      setAddresses(
        (data.Items || []).map((item) => ({
          id: item.cep,
          street: item.rua,
          bairro: item.bairro,
          numero: item.numero,
          ponto_referencia: item.ponto_referencia,
        }))
      );
    } catch (error) {
      console.log("Erro ao buscar endereços", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ✅ EXCLUIR
  const handleDelete = (cep) => {
    showModal({
      title: "Excluir Endereço",
      message: "Deseja remover este endereço?",
      confirmText: "EXCLUIR",
      onConfirm: async () => {
        try {
          await dynamoDB.send(
            new DeleteCommand({
              TableName: TABLE_NAME,
              Key: { cep },
            })
          );
          closeModal();
          fetchAddresses();
        } catch (error) {
          console.log("Erro ao excluir", error);
        }
      },
      onCancel: closeModal,
    });
  };

  // ✅ EDITAR
  const handleEdit = async (id) => {
  try {
    const novoEndereco = {
      cep: Number(cep),
      rua,
      bairro,
      numero: Number(numero),
      ponto_referencia,
    };

    const params = {
      TableName: "enderecos",
      Key: {
        cep: Number(id), // ✅ chave correta
      },
      UpdateExpression: `
        SET rua = :rua,
            bairro = :bairro,
            numero = :numero,
            ponto_referencia = :ponto
      `,
      ExpressionAttributeValues: {
        ":rua": novoEndereco.rua,
        ":bairro": novoEndereco.bairro,
        ":numero": novoEndereco.numero,
        ":ponto": novoEndereco.ponto_referencia,
      },
      ReturnValues: "UPDATED_NEW",
    };

    await dynamoDB.send(new UpdateCommand(params));

    Alert.alert("Sucesso", "Endereço atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao editar:", error);
    Alert.alert("Erro", "Não foi possível atualizar o endereço.");
  }
};

  // ✅ CADASTRAR COM INPUT DO USUÁRIO
  const handleCadastrar = async () => {
    if (!cep || !rua || !bairro || !ponto_referencia || !numero) {
      showModal({
        title: "Atenção",
        message: "Preencha todos os campos.",
        isAlert: true,
        onConfirm: closeModal,
      });
      return;
    }

    const novoEndereco = {
      cep: Number(cep),
      rua,
      bairro,
      numero: Number(numero),
      ponto_referencia,
    };

    try {
      await dynamoDB.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: novoEndereco,
        })
      );

      setCep("");
      setRua("");
      setBairro("");
      setNumero("");
      setPontoReferencia("");

      showModal({
        title: "Endereço Cadastrado",
        message: "Endereço salvo com sucesso.",
        confirmText: "OK",
        onConfirm: () => {
          closeModal();
          fetchAddresses();
        },
        isAlert: true,
      });
    } catch (error) {
      console.log("Erro ao cadastrar", error);
    }
  };

  // ✅ ITEM
  const AddressBox = ({ address }) => (
    <View style={styles.addressBox}>
      {address.isDefault && (
        <View style={styles.defaultTag}>
          <Text style={styles.defaultTagText}>Padrão</Text>
        </View>
      )}

      <Text style={{ 
  fontSize: 14, 
  fontWeight: "bold", 
  color: "#001f3f",
  marginBottom: 2
}}>
  CEP: {address.id}
</Text>

<Text style={{ 
  fontSize: 18, 
  fontWeight: "bold", 
  color: "#052242",
  marginBottom: 6
}}>
  {address.street}
</Text>

<View style={{ marginTop: 4 }}>
  <Text style={{ fontSize: 14, color: "#555" }}>
    Bairro: {address.bairro}
  </Text>

  <Text style={{ fontSize: 14, color: "#555" }}>
    Número: {address.numero}
  </Text>

  {address.ponto_referencia ? (
    <Text style={{ fontSize: 13, color: "#777", fontStyle: "italic", marginTop: 4 }}>
      Referência: {address.ponto_referencia}
    </Text>
  ) : null}
</View>

      <View style={styles.divider} />

      <View style={styles.addressActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(address.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#C4413B" />
          <Text style={[styles.actionButtonText, { color: "#C4413B" }]}>
            Excluir
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openEditModal(address)}
        >
          <Ionicons name="create-outline" size={18} color="#052242" />
          <Text style={[styles.actionButtonText, { color: "#052242" }]}>
            Editar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  <Modal visible={modalEditVisible} transparent animationType="fade">
  <View
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View
      style={{
        backgroundColor: "#fff",
        width: "90%",
        borderRadius: 10,
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Editar Endereço
      </Text>

      <TextInput
        value={rua}
        onChangeText={setRua}
        placeholder="Rua"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        value={bairro}
        onChangeText={setBairro}
        placeholder="Bairro"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        value={numero}
        onChangeText={setNumero}
        placeholder="Número"
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        value={ponto_referencia}
        onChangeText={setPontoReferencia}
        placeholder="Ponto de referência"
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={() => setModalEditVisible(false)}
          style={{
            padding: 12,
            backgroundColor: "#ccc",
            borderRadius: 5,
            width: "48%",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            await handleEdit(enderecoEditando.id);
            setModalEditVisible(false);
          }}
          style={{
            padding: 12,
            backgroundColor: "#001f3f",
            borderRadius: 5,
            width: "48%",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

return (
  <>
   <SafeAreaView showsHorizontalScrollIndicator={false}
 style={{ flex: 1, backgroundColor: "#F3ECE2" }}>
    {/* MODAL */}
    <Modal visible={modalEditVisible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            width: "90%",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Editar Endereço
          </Text>

          <TextInput
            value={rua}
            onChangeText={setRua}
            placeholder="Rua"
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />

          <TextInput
            value={bairro}
            onChangeText={setBairro}
            placeholder="Bairro"
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />

          <TextInput
            value={numero}
            onChangeText={setNumero}
            placeholder="Número"
            keyboardType="numeric"
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />

          <TextInput
            value={ponto_referencia}
            onChangeText={setPontoReferencia}
            placeholder="Ponto de referência"
            style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              onPress={() => setModalEditVisible(false)}
              style={{
                padding: 12,
                backgroundColor: "#ccc",
                borderRadius: 5,
                width: "48%",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await handleEdit(enderecoEditando.id);
                setModalEditVisible(false);
              }}
              style={{
                padding: 12,
                backgroundColor: "#001f3f",
                borderRadius: 5,
                width: "48%",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

      <CustomModal
        isVisible={isModalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        onCancel={modalConfig.onCancel}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        isAlert={modalConfig.isAlert}
      />

      {/* HEADER */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#001f3f" />
        </TouchableOpacity>

        <Text style={styles.titulo}>Endereços</Text>
        <Image source={{ uri: logo }} style={styles.logo} />
      </View>

      <View style={styles.shadowLine}></View>

      {/* LISTA */}
      <Text style={styles.titulo2}>Endereços cadastrados</Text>

      {addresses.length === 0 ? (
        <Text style={styles.vazio}>
        Nenhum endereço cadastrado ainda
      </Text>
      ) : (
        addresses.map((address) => (
          <View key={address.id} style={styles.lista}>
            <AddressBox address={address} />
          </View>
        ))
      )}

      {/* INPUTS */}
      <View style={styles.profileInfo}>
        <Text style={styles.titulo1}>Adicionar novo endereço</Text>
        <TextInput
          placeholder="CEP"
          keyboardType="numeric"
          value={cep}
          onChangeText={setCep}
          style={styles.input}
        />

        <TextInput
          placeholder="Rua"
          value={rua}
          onChangeText={setRua}
          style={styles.input}
        />

        <TextInput
          placeholder="Bairro"
          value={bairro}
          onChangeText={setBairro}
          style={styles.input}
        />

        <TextInput
          placeholder="Número"
          value={numero}
          onChangeText={setNumero}
          style={styles.input}
          keyboardType="numeric"
        />

        <TextInput
          placeholder="Ponto de Referência"
          value={ponto_referencia}
          onChangeText={setPontoReferencia}
          style={styles.input}
        />


        <TouchableOpacity style={styles.saveButton} onPress={handleCadastrar}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Cadastrar Endereço</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
    </SafeAreaView>
  </>
);}
const styles = StyleSheet.create({
  vazio: {
    marginLeft: 25,
    marginBottom: 30,
  color: '#777',
  marginTop: 20
},
container: { flex: 1, backgroundColor: "#F3ECE2"},
  scroll: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 92,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#052242",
    marginLeft: -100,
  },
    titulo1: {
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 5,
    fontWeight: "bold",
    color: "#052242",
  },
    titulo2: {
    fontSize: 20,
    marginBottom: -12,
    marginLeft: 25,
    fontWeight: "bold",
    color: "#052242",
  },
  logo: { width: 77, height: 40, marginLeft: 10 },
  shadowLine: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderBottomWidth: 0.8,
    marginBottom: 20,
    borderBottomColor: "#00000025",
  },
  profileInfo: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    marginBottom: 30,
  },
   input: {
    backgroundColor: "#05224210",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 15,
  },
  lista: {
    padding: 20,
    
  },
  addressBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    position: 'relative',
  },
  defaultTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#001f3f',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  defaultTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#001f3f",
    marginBottom: 5,
    marginTop: 10,
  },
  addressDetails: {
    fontSize: 14,
    color: "#555",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  addressActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
  },
  actionButtonText: {
    color: "#001f3f",
    fontWeight: "bold",
    fontSize: 15,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#001f3f",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    alignSelf: "stretch",
  },
  saveButtonText: {
    marginLeft: 8,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

// ---------------------------------------------
// 4. ESTILOS DO MODAL CUSTOMIZADO
// ---------------------------------------------

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "85%",
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#001f3f", 
  },
  modalMessage: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 4,
    padding: 12,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#001f3f",
    width: "45%",
  },
  buttonCancel: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#A9A9A9",
  },
  buttonConfirm: {
    backgroundColor: "#001f3f",
  },
  textCancel: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
  textConfirm: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});