import { View, Text, StyleSheet } from 'react-native';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
  sm: { height: 24, fontSize: 11, px: 6 },
  md: { height: 32, fontSize: 14, px: 8 },
  lg: { height: 40, fontSize: 18, px: 10 },
  xl: { height: 52, fontSize: 24, px: 14 },
};

export default function Logo({ size = 'md' }: LogoProps) {
  const s = SIZES[size];

  return (
    <View style={[styles.container, { height: s.height }]}>
      {/* SHERPA block — sky blue */}
      <View style={[styles.sherpaBlock, { paddingHorizontal: s.px, height: s.height }]}>
        <Text style={[styles.text, { fontSize: s.fontSize }]}>SHERPA</Text>
      </View>
      {/* Diagonal slash — border-triangle trick */}
      <View
        style={{
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderTopWidth: s.height,
          borderTopColor: '#00a9e0',
          borderRightWidth: Math.round(s.height * 0.35),
          borderRightColor: '#ff4500',
          borderBottomWidth: 0,
          borderLeftWidth: 0,
        }}
      />
      {/* PROS block — orange-red */}
      <View style={[styles.prosBlock, { paddingHorizontal: s.px, height: s.height }]}>
        <Text style={[styles.text, { fontSize: s.fontSize }]}>PROS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
    borderRadius: 4,
  },
  sherpaBlock: {
    backgroundColor: '#00a9e0',
    justifyContent: 'center',
  },
  prosBlock: {
    backgroundColor: '#ff4500',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontWeight: '900',
    letterSpacing: -0.5,
  },
});
