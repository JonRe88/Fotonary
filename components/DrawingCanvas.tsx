import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, PanResponder, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DrawingPath } from '@/types/game';
import { Eraser, Trash2, Palette } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface DrawingCanvasProps {
  disabled?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const CANVAS_HEIGHT = 400;

const COLORS = ['#000000', '#3B82F6', '#10B981', '#F97316', '#EF4444', '#8B5CF6', '#F59E0B', '#EC4899'];
const STROKE_WIDTHS = [2, 4, 8, 12];

export function DrawingCanvas({ disabled = false }: DrawingCanvasProps) {
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState(4);
  const [isErasing, setIsErasing] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  
  const pathRef = useRef<string>('');

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onMoveShouldSetPanResponder: () => !disabled,

    onPanResponderGrant: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      const newPath = `M${locationX},${locationY}`;
      pathRef.current = newPath;
      setCurrentPath(newPath);
    },

    onPanResponderMove: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      const newPath = `${pathRef.current} L${locationX},${locationY}`;
      pathRef.current = newPath;
      setCurrentPath(newPath);
    },

    onPanResponderRelease: () => {
      if (pathRef.current && !isErasing) {
        const newDrawingPath: DrawingPath = {
          id: Date.now().toString(),
          path: pathRef.current,
          color: selectedColor,
          strokeWidth: selectedStrokeWidth,
        };
        setPaths(prev => [...prev, newDrawingPath]);
      }
      pathRef.current = '';
      setCurrentPath('');
    },
  });

  const handleClearCanvas = () => {
    setPaths([]);
    setCurrentPath('');
    pathRef.current = '';
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  return (
    <View style={styles.container}>
      {/* Drawing Area */}
      <View style={styles.canvasContainer}>
        <View
          style={styles.canvas}
          {...panResponder.panHandlers}
        >
          <Svg width="100%" height={CANVAS_HEIGHT} style={styles.svg}>
            {paths.map((path) => (
              <Path
                key={path.id}
                d={path.path}
                stroke={path.color}
                strokeWidth={path.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}
            {currentPath && !isErasing && (
              <Path
                d={currentPath}
                stroke={selectedColor}
                strokeWidth={selectedStrokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </Svg>
        </View>
      </View>

      {/* Tools */}
      <Animated.View entering={FadeInUp.delay(200)} style={styles.toolsContainer}>
        {/* Color Palette Button */}
        <TouchableOpacity
          style={[styles.toolButton, showColorPalette && styles.activeTool]}
          onPress={() => setShowColorPalette(!showColorPalette)}
        >
          <Palette size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        {/* Eraser */}
        <TouchableOpacity
          style={[styles.toolButton, isErasing && styles.activeTool]}
          onPress={toggleEraser}
        >
          <Eraser size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        {/* Clear */}
        <TouchableOpacity style={styles.toolButton} onPress={handleClearCanvas}>
          <Trash2 size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        {/* Current Color Indicator */}
        <View style={[styles.colorIndicator, { backgroundColor: selectedColor }]} />
      </Animated.View>

      {/* Color Palette */}
      {showColorPalette && (
        <Animated.View entering={FadeInUp} style={styles.colorPalette}>
          <View style={styles.colorsRow}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => {
                  setSelectedColor(color);
                  setIsErasing(false);
                }}
              />
            ))}
          </View>
          
          <View style={styles.strokeWidthContainer}>
            {STROKE_WIDTHS.map((width) => (
              <TouchableOpacity
                key={width}
                style={[
                  styles.strokeOption,
                  selectedStrokeWidth === width && styles.selectedStroke,
                ]}
                onPress={() => setSelectedStrokeWidth(width)}
              >
                <View
                  style={[
                    styles.strokePreview,
                    {
                      width: width * 2,
                      height: width * 2,
                      borderRadius: width,
                      backgroundColor: selectedColor,
                    },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  canvasContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  svg: {
    flex: 1,
  },
  toolsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1F2937',
    gap: 12,
  },
  toolButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTool: {
    backgroundColor: '#3B82F6',
  },
  colorIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 'auto',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  colorPalette: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  colorsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    justifyContent: 'center',
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  strokeWidthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  strokeOption: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedStroke: {
    backgroundColor: '#3B82F6',
  },
  strokePreview: {
    backgroundColor: '#FFFFFF',
  },
});