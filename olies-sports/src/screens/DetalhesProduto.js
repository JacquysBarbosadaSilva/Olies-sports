import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Importação de ícones: 
// Ionicons para Seta, Estrelas, Coração, Cartão
// FontAwesome/FontAwesome5 para Régua e QR Code (simulando Pix)
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; 

// --- Dados Mock ---
const productData = {
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45', '46'],
    description: "Este tênis? Ele foi feito para ser diferente. Equipado com tecnologia pronta para as quadras, o Zion 4 ajuda a impulsionar um jogo explosivo. A unidade Air Zoom em toda a extensão e a entressola drop-in oferecem o amortecimento responsivo que seus movimentos verticais de alta energia exigem.",
    rating: 4.5,
};

// --- Componente principal (Nome alterado) ---
const DetalhesProduto = () => {
    
    const [selectedSize, setSelectedSize] = useState('40');

    const handleSelectSize = (size) => {
        setSelectedSize(size);
    };
    
    // ... (renderSizeItem e renderStars permanecem iguais, apenas com a nova variável de nome) ...
    const renderSizeItem = (size) => {
        const isSelected = size === selectedSize;
        return (
            <TouchableOpacity 
                key={size} 
                style={[
                    styles.sizeItem, 
                    isSelected && styles.sizeItemSelected 
                ]}
                onPress={() => handleSelectSize(size)}
            >
                <Text style={[
                    styles.sizeText, 
                    isSelected && styles.sizeTextSelected
                ]}>
                    {size}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const totalStars = 5;
        let stars = [];

        for (let i = 0; i < totalStars; i++) {
            if (i < fullStars) {
                stars.push(<Ionicons key={i} name="star" size={20} color={PRIMARY_COLOR} />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<Ionicons key={i} name="star-half" size={20} color={PRIMARY_COLOR} />);
            } else {
                stars.push(<Ionicons key={i} name="star-outline" size={20} color={PRIMARY_COLOR} />);
            }
        }
        return <View style={styles.starsContainer}>{stars}</View>;
    };

    const renderFitBar = (label, positionPercentage) => { 
        return (
            <View style={styles.fitBarSection}>
                <Text style={styles.fitBarLabel}>{label}</Text>
                
                <View style={styles.fitBarContainer}>
                    <Text style={styles.fitBarText}>Muito pequeno</Text>
                    <Text style={styles.fitBarText}>Muito grande</Text>
                </View>

                <View style={styles.barLineContainer}>
                    <Text style={styles.fitBarCenterText}>Fiel ao tamanho</Text>
                    <View style={styles.barLine}>
                        <View style={[styles.barIndicator, { left: `${positionPercentage}%` }]} />
                    </View>
                </View>
            </View>
        );
    };


    return (
        <ScrollView style={styles.container}>
            
            <View style={styles.sectionPadding}>

                <View style={styles.sizeTitleRow}>
                    <Text style={styles.sizeTitle}>Tamanho</Text>
                    <Ionicons 
                        name="md-ruler-outline"
                        size={18} 
                        color={PRIMARY_COLOR} 
                        style={styles.rulerIcon}
                    />
                     <View style={styles.selectedSizeBox}>
                        <Text style={styles.selectedSizeText}>{selectedSize}</Text>
                    </View>
                </View>
                
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.sizesScroll}
                >
                    {productData.sizes.map(renderSizeItem)}
                </ScrollView>
            </View>

            {/* 3. Botão Adicionar ao Carrinho */}
            <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>Adicionar ao carrinho</Text>
            </TouchableOpacity>

            <View style={styles.paymentIconsContainer}>
                
                {/* Ícone de Cartão de Crédito */}
                <TouchableOpacity style={styles.paymentIconItem}>
                    <Ionicons 
                        name="card-outline" 
                        size={20} 
                        color={PRIMARY_COLOR} 
                    />
                    <Text style={styles.paymentIconText}>Cartão</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.paymentIconItem}>
                    <FontAwesome5 
                        name="pix" 
                        size={18} 
                        color={PRIMARY_COLOR} 
                    />
                    <Text style={styles.paymentIconText}>Pix</Text>
                </TouchableOpacity>

            </View>
            
            {/* 5. Detalhes do Produto */}
            <View style={styles.productDetailSection}>
                <Text style={styles.productDetailTitle}>Jordan Zion 4</Text>
                <Text style={styles.productDetailDescription}>
                    {productData.description}
                </Text>
            </View>

            {/* 6. Avaliações e Comentários */}
            <View style={styles.reviewsSection}>
                <Text style={styles.reviewsTitle}>Avaliações e comentários</Text>
                
                <View style={styles.ratingRow}>
                    <Text style={styles.ratingValue}>{productData.rating.toFixed(1)}</Text>
                    {renderStars(productData.rating)}
                </View>

                <TouchableOpacity>
                    <Text style={styles.commentsLink}>Comentários</Text>
                </TouchableOpacity>

                {renderFitBar("Tamanho", 50)} 
                {renderFitBar("Largura", 50)}

            </View>

        </ScrollView>
    );
};

// --- Estilos ---
const PRIMARY_COLOR = '#052242';
const BACKGROUND_COLOR = '#FBFBF5';
const INDICATOR_COLOR = '#333333';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    sectionPadding: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    
    // NOVO: Linha do Título e Ícone de Tamanho
    sizeTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sizeTitle: {
        fontSize: 14,
        fontWeight: '500',
    },
    rulerIcon: {
        marginLeft: 5,
        marginRight: 10,
    },
    selectedSizeBox: {
        width: 30,
        height: 18,
        borderWidth: 1,
        borderColor: '#999',
        justifyContent: 'center',
        alignItems: 'center',
        // O box de tamanho selecionado deve estar mais distante do título 'Tamanho'
        position: 'absolute', 
        right: 0, 
    },
    selectedSizeText: {
        fontSize: 12,
        color: '#999',
    },

    // ... (Estilos de sizeItem, addToCartButton e texto permanecem iguais) ...
    sizesScroll: {
        marginTop: 5,
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    sizeItem: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: '#FFFFFF',
    },
    sizeItemSelected: {
        borderColor: PRIMARY_COLOR, 
        borderWidth: 2,
    },
    sizeText: {
        color: '#333333',
        fontSize: 14,
        fontWeight: '400',
    },
    sizeTextSelected: {
        color: PRIMARY_COLOR,
        fontWeight: 'bold',
    },
    addToCartButton: {
        backgroundColor: PRIMARY_COLOR,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 5,
        marginBottom: 15, // Reduzido para encaixar os ícones de pagamento
    },
    addToCartText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // NOVO: Container dos Ícones de Pagamento
    paymentIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Centraliza os dois ícones
        marginHorizontal: 20,
        marginBottom: 20, // Espaço antes da próxima seção
    },
    paymentIconItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        marginHorizontal: 5,
    },
    paymentIconText: {
        marginLeft: 8,
        fontSize: 14,
        color: PRIMARY_COLOR,
        fontWeight: '500',
    },

    // ... (Restante dos estilos permanecem iguais) ...
    productDetailSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    reviewsSection: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    // Estilos das Barras de Ajuste (Mantidos)
    fitBarSection: {
        marginBottom: 15,
        marginTop: 15,
    },
    fitBarLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    fitBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 5,
    },
    fitBarText: {
        fontSize: 12,
        color: '#555555',
    },
    barLineContainer: {
        position: 'relative',
        height: 30,
    },
    fitBarCenterText: {
        position: 'absolute',
        fontSize: 12,
        fontWeight: '500',
        color: PRIMARY_COLOR,
        left: '50%',
        transform: [{ translateX: -40 }],
        top: 0,
    },
    barLine: {
        flex: 1,
        height: 4,
        backgroundColor: '#CCCCCC',
        borderRadius: 2,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    barIndicator: {
        position: 'absolute',
        top: -6,
        width: 4,
        height: 15,
        backgroundColor: INDICATOR_COLOR,
        transform: [{ translateX: -2 }],
    },
});

export default DetalhesProduto; // Exporta o nome do componente atualizado