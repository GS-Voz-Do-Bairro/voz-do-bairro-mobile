import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FONTS } from '../constants/theme';
import { infoCategoria } from '../constants/categorias';

export default function CategoriaTag({ categoria }) {
  const info = infoCategoria(categoria);
  return (
    <View style={styles.tag}>
      <Feather name={info.icon} size={12} color={info.cor} />
      <Text style={[styles.texto, { color: info.cor }]}>{info.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  texto: { fontFamily: FONTS.bold, fontSize: FONTS.sizes.xs },
});
