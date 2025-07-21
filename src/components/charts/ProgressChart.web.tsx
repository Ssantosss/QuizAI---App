import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {COLORS, FONT_SIZES, FONT_WEIGHTS} from '@/constants';

interface ProgressChartProps {
  data: number[];
  width: number;
  height: number;
  title?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  width: chartWidth,
  height,
  title,
}) => {
  const maxValue = Math.max(...data);
  const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={[styles.chart, {width: chartWidth, height}]}>
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>{maxValue}</Text>
          <Text style={styles.axisLabel}>{Math.round(maxValue * 0.5)}</Text>
          <Text style={styles.axisLabel}>0</Text>
        </View>
        <View style={styles.chartArea}>
          <View style={styles.barsContainer}>
            {data.map((value, index) => (
              <View key={index} style={styles.barColumn}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${(value / maxValue) * 100}%`,
                      backgroundColor: COLORS.primary,
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{days[index]}</Text>
              </View>
            ))}
          </View>
          <View style={styles.gridLines}>
            {[0, 1, 2].map((line) => (
              <View key={line} style={styles.gridLine} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.dark,
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    backgroundColor: COLORS.white,
    padding: 16,
    flexDirection: 'row',
    shadowColor: COLORS.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  yAxis: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 12,
    width: 40,
  },
  axisLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray400,
    fontWeight: FONT_WEIGHTS.medium,
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 30,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: COLORS.gray200,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 30,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 40,
  },
  bar: {
    width: 24,
    minHeight: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray400,
    fontWeight: FONT_WEIGHTS.medium,
  },
});

export default ProgressChart;