import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const produtos = [
  {
    id: '1',
    nome: 'Nike Tiempo Legend 9 Club IC',
    preco: 199.99,
    desconto: '13% OFF',
    categoria: 'Tênis',
    imagem: require('./assets/nike_tiempo.png'),
  },
  {
    id: '2',
    nome: 'Puma TRC Blaze Court',
    preco: 199.99,
    desconto: '13% OFF',
    categoria: 'Tênis',
    imagem: require('./assets/puma_trc.png'),
  },
  {
    id: '3',
    nome: 'Nike Court Vision Low Next Nature',
    preco: 299.99,
    desconto: '5% OFF',
    categoria: 'Tênis',
    imagem: require('./assets/nike_court.png'),
  },
  {
    id: '4',
    nome: 'Adidas Calça Essentials 3S',
    preco: 179.99,
    desconto: '35% OFF',
    categoria: 'Calça',
    imagem: require('./assets/adidas_calca.png'),
  },
  // Adicione os outros produtos aqui...
];

export default function ProdutosScreen() {
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [filtroSelecionado, setFiltroSelecionado] = useState('Todos');
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');

  const filtrarProdutos = () => {
    return produtos.filter((item) => {
      const emPromocao = filtroSelecionado === 'Promocao' ? !!item.desconto : true;
      const dentroFaixa =
        (!precoMin || item.preco >= parseFloat(precoMin)) &&
        (!precoMax || item.preco <= parseFloat(precoMax));
      return emPromocao && dentroFaixa;
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.imagem} style={styles.imagem} resizeMode="contain" />
      <View style={styles.info}>
        <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
        {item.desconto ? <Text style={styles.desconto}>{item.desconto}</Text> : null}
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.categoria}>{item.categoria}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header com botão de filtro */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setFiltroAberto(true)} style={styles.filtroBotao}>
          <Ionicons name="filter-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtrarProdutos()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        columnWrapperStyle={styles.coluna}
      />

      {/* Modal de filtro */}
      <Modal visible={filtroAberto} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setFiltroAberto(false)}
          activeOpacity={1}
        >
          <Animated.View style={styles.filtroContainer}>
            <Text style={styles.filtroTitulo}>Filtrar por:</Text>

            <TouchableOpacity
              style={[styles.opcao, filtroSelecionado === 'Todos' && styles.opcaoAtiva]}
              onPress={() => setFiltroSelecionado('Todos')}
            >
              <Text style={styles.textoOpcao}>Todos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.opcao, filtroSelecionado === 'Promocao' && styles.opcaoAtiva]}
              onPress={() => setFiltroSelecionado('Promocao')}
            >
              <Text style={styles.textoOpcao}>Em promoção</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 20 }}>
              <Text style={styles.filtroSubtitulo}>Preço mínimo:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 100"
                value={precoMin}
                onChangeText={setPrecoMin}
              />
              <Text style={styles.filtroSubtitulo}>Preço máximo:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 1000"
                value={precoMax}
                onChangeText={setPrecoMax}
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    padding: 16,
    alignItems: 'flex-end',
  },
  filtroBotao: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 8,
  },
  lista: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  coluna: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#f9f9f9',
    margin: 8,
    borderRadius: 8,
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  imagem: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  info: {
    alignItems: 'center',
  },
  preco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  desconto: {
    fontSize: 14,
    color: '#d00',
    marginBottom: 4,
  },
  nome: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 2,
  },
  categoria: {
    fontSize: 12,
    color: '#666',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  filtroContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  filtroTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filtroSubtitulo: {
    fontSize: 14,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 4,
    borderRadius: 8,
  },
  opcao: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
  opcaoAtiva: {
    backgroundColor: '#cce5ff',
  },
  textoOpcao: {
    fontSize: 14,
  },
});
