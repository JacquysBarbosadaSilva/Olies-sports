import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Bem-vindo ao Olie's Sports!</Text>
			<Text style={styles.subtitle}>Escolha uma opção no menu para começar.</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F3ECE2',
	},  
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
	},
});
