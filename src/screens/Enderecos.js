import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ATENÇÃO: A URL é longa e pode expirar. Usando o começo como referência.
const logoUrl = "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?..."; 

// Dados Fictícios (Mock) para Endereços
const initialAddresses = [
  {
    id: "1",
    street: "Rua Arthur Benedito de Oliveira Porto, 25",
    details: "Jardim Rafael - CEP 12288-460 - Caçapava - SP",
    isDefault: true,
  },
  {
    id: "2",
    street: "Av. Brasil, 1000",
    details: "Centro - CEP 01000-000 - São Paulo - SP",
    isDefault: false,
  },
];

// ---------------------------------------------
// 1. COMPONENTE DE MODAL CUSTOMIZADO (ALERTA)
// ---------------------------------------------

const CustomModal = ({
  isVisible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "CONFIRMAR",
  isAlert = false, // Se for true, esconde o botão CANCELAR
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
    >
      {/* Background Escurecido */}
      <View style={modalStyles.centeredView}>
        {/* Conteúdo do Modal (a caixa branca) */}
        <View style={modalStyles.modalView}>
          
          {/* Ícone (simulando sucesso ou aviso) */}
          {isAlert && (
            <Ionicons
              name={title.includes("Sucesso") || title.includes("Cadastrado") ? "checkmark-circle" : "warning"}
              size={40}
              color={title.includes("Sucesso") || title.includes("Cadastrado") ? "#001f3f" : "#C4413B"}
              style={{ marginBottom: 15 }}
            />
          )}

          <Text style={modalStyles.modalTitle}>{title}</Text>
          <Text style={modalStyles.modalMessage}>{message}</Text>

          <View style={modalStyles.buttonContainer}>
            {/* Botão Cancelar */}
            {!isAlert && (
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.buttonCancel]}
                onPress={onCancel}
              >
                <Text style={modalStyles.textCancel}>CANCELAR</Text>
              </TouchableOpacity>
            )}

            {/* Botão Confirmar */}
            <TouchableOpacity
              style={[
                modalStyles.button,
                modalStyles.buttonConfirm,
                isAlert ? { width: '80%', marginHorizontal: '10%' } : null,
              ]}
              onPress={onConfirm}
            >
              <Text style={modalStyles.textConfirm}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


// ---------------------------------------------
// 2. TELA PRINCIPAL: EnderecosScreen
// ---------------------------------------------

export default function EnderecosScreen({ navigation }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  
  // Estado para controlar a visibilidade e o conteúdo do modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  // --- Funções de Controle do Modal ---

  const showModal = (config) => {
    setModalConfig(config);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalConfig({});
  };

  // --- Funções de Ação com Modal ---

  const handleDelete = (addressId) => {
    showModal({
      title: "Excluir Endereço",
      message: "Tem certeza que deseja remover este endereço?",
      onConfirm: () => {
        setAddresses(addresses.filter((addr) => addr.id !== addressId));
        closeModal();
        // Feedback de sucesso
        showModal({
            title: "Sucesso!",
            message: "Endereço excluído com sucesso.",
            confirmText: "OK",
            onConfirm: closeModal,
            isAlert: true, 
        });
      },
      onCancel: closeModal,
    });
  };

  const handleEdit = (addressId) => {
    // Na aplicação real, você faria navigation.navigate("EditarEndereco", { addressId });

    // SIMULAÇÃO: Alerta de Edição Concluída
    showModal({
        title: "Edição Concluída",
        message: "As alterações no endereço foram salvas com sucesso.",
        confirmText: "FECHAR",
        onConfirm: closeModal,
        isAlert: true,
    });
  };

  const handleCadastrar = () => {
    // Na aplicação real, você faria navigation.navigate("CadastrarEndereco");

    // SIMULAÇÃO: Confirmação de Cadastro
    showModal({
        title: "Endereço Cadastrado",
        message: "Seu novo endereço foi salvo com sucesso.",
        confirmText: "OK",
        onConfirm: closeModal,
        isAlert: true, 
    });
  };
  
  // --- Componente de Endereço Individual ---
  const AddressBox = ({ address }) => (
    <View style={styles.addressBox}>
      {address.isDefault && (
        <View style={styles.defaultTag}>
          <Text style={styles.defaultTagText}>Padrão</Text>
        </View>
      )}
      <Text style={styles.addressTitle}>{address.street}</Text>
      <Text style={styles.addressDetails}>{address.details}</Text>

      <View style={styles.divider} />

      <View style={styles.addressActions}>
        {/* Botão de Excluir */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(address.id)} 
        >
          <Ionicons name="trash-outline" size={18} color="#C4413B" style={{ marginRight: 6 }} />
          <Text style={[styles.actionButtonText, { color: '#C4413B' }]}>Excluir</Text>
        </TouchableOpacity>

        {/* Botão de Editar */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(address.id)}
        >
          <Ionicons name="pencil-outline" size={18} color="#001f3f" style={{ marginRight: 6 }} />
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* O CustomModal é renderizado no topo */}
      <CustomModal
        isVisible={isModalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        onCancel={modalConfig.onCancel}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        isAlert={modalConfig.isAlert}
      />
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#001f3f" />
        </TouchableOpacity>

        <Text style={styles.title}>Endereços</Text>
        <Image source={{ uri: logoUrl }} style={styles.logo} />
      </View>

      {/* Conteúdo: Lista de Endereços */}
      <View style={styles.content}>
        {addresses.map((address) => (
          <AddressBox key={address.id} address={address} />
        ))}

        {/* Botão para Cadastrar Novo Endereço */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleCadastrar}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.saveButtonText}>Cadastrar Novo Endereço</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------
// 3. ESTILOS DA TELA
// ---------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3ECE2",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3ECE2",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#001f3f",
  },
  logo: {
    width: 60,
    height: 50,
    resizeMode: "contain",
  },
  content: {
    paddingHorizontal: 20,
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
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
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