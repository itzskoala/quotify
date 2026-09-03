/**
 * Hand-drawn, single-stroke "cute stick figure" artwork for onboarding v4 —
 * a book, a sunflower, two stick figures in a photo frame (Value Prop), and
 * a row of "what to expect" icons (Expectations). Same visual language as
 * the SVGs drawn for the "Wireframes for Quotable" Figma page, translated to
 * react-native-svg. Deliberately separate from illustrations.tsx's
 * "Corporate Memphis" figures (deleted with the v3 palette) — this is a
 * different, sparser style on purpose.
 */
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { OnboardingColors } from '@/constants/theme';

const STROKE = OnboardingColors.ink;

export function ValuePropIllustration({ size = 280 }: { size?: number }) {
  const h = size * (120 / 280);
  return (
    <Svg width={size} height={h} viewBox="0 0 280 120" fill="none">
      {/* book */}
      <Path
        d="M14 58 Q46 40 78 58 L78 100 Q46 84 14 100 Z"
        stroke={STROKE}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M46 48 L46 90" stroke={STROKE} strokeWidth={2.4} strokeLinecap="round" />
      <Path d="M22 68 Q34 62 44 68" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M22 80 Q34 74 44 80" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" />

      {/* sunflower */}
      <G>
        <Circle cx={140} cy={34} r={11} stroke={STROKE} strokeWidth={2.2} />
        <Circle cx={140} cy={34} r={2.5} fill={STROKE} />
        <Ellipse cx={140} cy={15} rx={4} ry={8} stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" />
        <Ellipse
          cx={153}
          cy={21}
          rx={4}
          ry={8}
          stroke={STROKE}
          strokeWidth={2.2}
          strokeLinecap="round"
          transform="rotate(45, 153, 21)"
        />
        <Ellipse
          cx={159}
          cy={34}
          rx={4}
          ry={8}
          stroke={STROKE}
          strokeWidth={2.2}
          strokeLinecap="round"
          transform="rotate(90, 159, 34)"
        />
        <Ellipse
          cx={153}
          cy={47}
          rx={4}
          ry={8}
          stroke={STROKE}
          strokeWidth={2.2}
          strokeLinecap="round"
          transform="rotate(135, 153, 47)"
        />
        <Ellipse cx={140} cy={53} rx={4} ry={8} stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" />
        <Ellipse
          cx={127}
          cy={47}
          rx={4}
          ry={8}
          stroke={STROKE}
          strokeWidth={2.2}
          strokeLinecap="round"
          transform="rotate(225, 127, 47)"
        />
        <Ellipse
          cx={121}
          cy={34}
          rx={4}
          ry={8}
          stroke={STROKE}
          strokeWidth={2.2}
          strokeLinecap="round"
          transform="rotate(270, 121, 34)"
        />
        <Ellipse
          cx={127}
          cy={21}
          rx={4}
          ry={8}
          stroke={STROKE}
          strokeWidth={2.2}
          strokeLinecap="round"
          transform="rotate(315, 127, 21)"
        />
        <Path d="M140 56 Q146 74 140 92" stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" />
      </G>

      {/* photo frame with two stick figures */}
      <Rect x={192} y={14} width={72} height={66} rx={5} stroke={STROKE} strokeWidth={2.2} />
      <G stroke={STROKE} strokeWidth={2} strokeLinecap="round">
        <Circle cx={214} cy={36} r={5.5} />
        <Path d="M214 41.5 L214 58" />
        <Path d="M205 48 L223 48" />
        <Path d="M214 58 L207 68" />
        <Path d="M214 58 L221 68" />
        <Circle cx={240} cy={36} r={5.5} />
        <Path d="M240 41.5 L240 58" />
        <Path d="M231 48 L249 48" />
        <Path d="M240 58 L233 68" />
        <Path d="M240 58 L247 68" />
        <Path d="M220 50 L234 50" />
      </G>
    </Svg>
  );
}

type ExpectIcon = 'wallpaper' | 'music' | 'chess' | 'climb';

function ExpectGlyph({ name }: { name: ExpectIcon }) {
  switch (name) {
    case 'wallpaper':
      return (
        <Svg width={44} height={44} viewBox="0 0 48 48" fill="none">
          <Rect x={4} y={4} width={40} height={40} rx={6} stroke={STROKE} strokeWidth={2.2} />
          <Circle cx={32} cy={14} r={3.5} stroke={STROKE} strokeWidth={2} />
          <Path
            d="M8 34 L18 20 L26 28 L32 20 L40 34"
            stroke={STROKE}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'music':
      return (
        <Svg width={44} height={44} viewBox="0 0 48 48" fill="none">
          <Ellipse
            cx={14}
            cy={36}
            rx={6}
            ry={5}
            stroke={STROKE}
            strokeWidth={2.2}
            transform="rotate(-12, 14, 36)"
          />
          <Path d="M20 35 L20 8 L36 4 L36 26" stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" />
          <Ellipse
            cx={30}
            cy={31}
            rx={6}
            ry={5}
            stroke={STROKE}
            strokeWidth={2.2}
            transform="rotate(-12, 30, 31)"
          />
        </Svg>
      );
    case 'chess':
      return (
        <Svg width={44} height={44} viewBox="0 0 48 48" fill="none">
          <Circle cx={24} cy={13} r={7} stroke={STROKE} strokeWidth={2.2} />
          <Path
            d="M14 44 L18 24 Q24 20 30 24 L34 44 Z"
            stroke={STROKE}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <Rect x={10} y={41} width={28} height={5} rx={2} stroke={STROKE} strokeWidth={2} />
        </Svg>
      );
    case 'climb':
      return (
        <Svg width={44} height={44} viewBox="0 0 48 48" fill="none">
          <Path
            d="M4 44 L24 8 L44 44 Z"
            stroke={STROKE}
            strokeWidth={2.2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Path d="M24 8 L29 2" stroke={STROKE} strokeWidth={2} strokeLinecap="round" />
          <Path d="M29 2 L37 5 L29 8 Z" stroke={STROKE} strokeWidth={1.6} strokeLinejoin="round" />
          <G stroke={STROKE} strokeWidth={1.8} strokeLinecap="round">
            <Circle cx={16} cy={30} r={2.6} />
            <Path d="M16 32.5 L14 39" />
            <Path d="M16 33 L20 30 L22 25" />
            <Path d="M14 39 L10.5 43" />
            <Path d="M14 39 L17.5 43" />
          </G>
        </Svg>
      );
  }
}

const ICONS: ExpectIcon[] = ['wallpaper', 'music', 'chess', 'climb'];

export function ExpectationsIcons() {
  return (
    <View style={styles.row}>
      {ICONS.map((name) => (
        <ExpectGlyph key={name} name={name} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

/**
 * A friendly waving stick figure in a circle frame, for the closing "CEO"
 * screen — deliberately illustrated rather than a photo. Nobody real is
 * depicted; it's the same hand-drawn language as the rest of onboarding.
 */
export function WavingFigure({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Circle cx={60} cy={60} r={56} stroke={STROKE} strokeWidth={2} opacity={0.4} />
      <G stroke={STROKE} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx={60} cy={46} r={13} />
        <Path d="M60 59 L60 84" />
        <Path d="M60 68 L44 78" />
        <Path d="M60 66 L76 52" />
        <Path d="M76 52 L84 42" />
        <Path d="M84 42 L80 34" />
        <Path d="M84 42 L92 40" />
        <Path d="M60 84 L50 104" />
        <Path d="M60 84 L70 104" />
      </G>
    </Svg>
  );
}
