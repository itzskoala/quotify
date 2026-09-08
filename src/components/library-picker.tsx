/**
 * The "save to library" popup opened by the Favorite button in
 * `PostDetailOverlay` — Spotify's "Add to Playlist" sheet is the reference:
 * a checklist of libraries to toggle the quote into (multi-select, a quote
 * can live in several), plus a "create new library" row. Favorites (the
 * app-wide `favorites` list, unrelated to Home's own save button) is always
 * pinned first since it's the same underlying list either way.
 */
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Quote } from '@/constants/quotable';
import { BrandFonts, Spacing, type BrandPalette } from '@/constants/theme';
import { useBrand } from '@/hooks/use-brand';
import * as haptics from '@/lib/haptics';
import { useAppState } from '@/providers/app-state';

type Props = {
  visible: boolean;
  quote: Quote;
  onClose: () => void;
};

export function LibraryPicker({ visible, quote, onClose }: Props) {
  const { libraries, isSaved, toggleFavorite, addToLibrary, removeFromLibrary, isInLibrary, createLibrary } =
    useAppState();
  const c = useBrand();
  const s = styles(c);
  const [creating, setCreating] = useState(false);
  const [draftName, setDraftName] = useState('');

  function submitNewLibrary() {
    const name = draftName.trim();
    if (!name) {
      setCreating(false);
      return;
    }
    haptics.success();
    const lib = createLibrary(name);
    addToLibrary(lib.id, quote);
    setDraftName('');
    setCreating(false);
  }

  return (
    // A real Modal, not just an absolutely-positioned View — this popup is
    // opened from inside PostDetailOverlay's ScrollView, and a plain
    // position:absolute View there gets clipped/scrolled by that ancestor
    // instead of floating over the whole screen. Modal portals to a
    // top-level layer regardless of where it's mounted in the tree.
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={StyleSheet.absoluteFill}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            haptics.tap();
            onClose();
          }}
        />
        <View style={s.sheet}>
          <ThemedText style={s.title}>save to library</ThemedText>

          <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
            <Row
              c={c}
              label="favorites"
              checked={isSaved(quote)}
              onPress={() => {
                haptics.success();
                toggleFavorite(quote);
              }}
            />
            {libraries.map((lib) => {
              const checked = isInLibrary(lib.id, quote);
              return (
                <Row
                  key={lib.id}
                  c={c}
                  label={lib.name}
                  checked={checked}
                  onPress={() => {
                    haptics.tap();
                    if (checked) {
                      removeFromLibrary(lib.id, quote);
                    } else {
                      addToLibrary(lib.id, quote);
                    }
                  }}
                />
              );
            })}
          </ScrollView>

          {creating ? (
            <View style={s.createRow}>
              <TextInput
                value={draftName}
                onChangeText={setDraftName}
                autoFocus
                placeholder="library name"
                placeholderTextColor={c.textFaint}
                style={s.input}
                onSubmitEditing={submitNewLibrary}
                maxLength={40}
              />
              <Pressable onPress={submitNewLibrary} hitSlop={8}>
                <ThemedText style={s.createLabel}>create</ThemedText>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => {
                haptics.tap();
                setCreating(true);
              }}
              style={s.newButton}>
              <ThemedText style={s.newButtonLabel}>+ create new library</ThemedText>
            </Pressable>
          )}

          <Pressable
            onPress={() => {
              haptics.tap();
              onClose();
            }}
            style={s.done}>
            <ThemedText style={s.doneLabel}>done</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Row({
  c,
  label,
  checked,
  onPress,
}: {
  c: BrandPalette;
  label: string;
  checked: boolean;
  onPress: () => void;
}) {
  const s = styles(c);
  return (
    <Pressable onPress={onPress} style={s.row}>
      <View style={[s.checkbox, checked && s.checkboxChecked]}>
        {checked ? <ThemedText style={s.checkmark}>✓</ThemedText> : null}
      </View>
      <ThemedText style={s.rowLabel}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = (c: BrandPalette) =>
  StyleSheet.create({
    sheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      maxHeight: '70%',
      backgroundColor: c.raised,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderColor: c.line,
      padding: Spacing.four,
      gap: Spacing.three,
    },
    title: {
      fontFamily: BrandFonts.valleyBold,
      fontSize: 18,
      color: c.text,
    },
    list: {
      maxHeight: 260,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      paddingVertical: Spacing.two,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 1.5,
      borderColor: c.line,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    checkmark: {
      fontSize: 14,
      color: c.onAccent,
      fontFamily: BrandFonts.valleyBold,
    },
    rowLabel: {
      fontFamily: BrandFonts.valleyMedium,
      fontSize: 16,
      color: c.text,
    },
    newButton: {
      paddingVertical: Spacing.two,
    },
    newButtonLabel: {
      fontFamily: BrandFonts.valleyMedium,
      fontSize: 15,
      color: c.textDim,
    },
    createRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
    },
    input: {
      flex: 1,
      fontFamily: BrandFonts.valley,
      fontSize: 15,
      color: c.text,
      borderBottomWidth: 1,
      borderBottomColor: c.line,
      paddingVertical: Spacing.one,
    },
    createLabel: {
      fontFamily: BrandFonts.valleyMedium,
      fontSize: 14,
      color: c.accent,
    },
    done: {
      alignItems: 'center',
      paddingVertical: Spacing.three,
      borderRadius: 999,
      backgroundColor: c.accent,
    },
    doneLabel: {
      fontFamily: BrandFonts.valleyMedium,
      fontSize: 15,
      color: c.onAccent,
    },
  });
