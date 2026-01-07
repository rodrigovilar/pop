import { useState } from 'react';
import { theme } from '../styles/theme';

interface PieChartProps {
    data: {
        label: string;
        value: number;
        color: string;
    }[];
    size?: number;
}

export function PieChart({ data, size = 200 }: PieChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let startAngle = 0;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2;

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Subtle shadow circle behind */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    stroke={theme.colors.border.subtle}
                    strokeWidth={2}
                    opacity={0.3}
                />

                {data.map((item, index) => {
                    const percentage = item.value / total;
                    const angle = percentage * 360;
                    const isHovered = hoveredIndex === index;

                    // For single item, just render a full circle
                    if (data.length === 1 && item.value > 0) {
                        return (
                            <circle
                                key={index}
                                cx={cx}
                                cy={cy}
                                r={radius}
                                fill={item.color}
                                style={{
                                    filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
                                    transition: 'filter 0.2s ease',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            />
                        );
                    }

                    // Calculate path for pie slice
                    const x1 = cx + radius * Math.cos((startAngle - 90) * (Math.PI / 180));
                    const y1 = cy + radius * Math.sin((startAngle - 90) * (Math.PI / 180));

                    const endAngle = startAngle + angle;
                    const x2 = cx + radius * Math.cos((endAngle - 90) * (Math.PI / 180));
                    const y2 = cy + radius * Math.sin((endAngle - 90) * (Math.PI / 180));

                    const largeArcFlag = angle > 180 ? 1 : 0;

                    const pathData = [
                        `M ${cx} ${cy}`, // Move to center
                        `L ${x1} ${y1}`, // Line to start of arc
                        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc to end point
                        'Z', // Close path back to center
                    ].join(' ');

                    const segment = (
                        <path
                            key={index}
                            d={pathData}
                            fill={item.color}
                            stroke={theme.colors.background.secondary}
                            strokeWidth={2}
                            style={{
                                filter: isHovered ? 'brightness(1.2) drop-shadow(0 0 8px rgba(0,0,0,0.4))' : 'brightness(1)',
                                transition: 'all 0.2s ease-out',
                                cursor: 'pointer',
                                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                transformOrigin: `${cx}px ${cy}px`,
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        />
                    );

                    startAngle += angle;
                    return segment;
                })}
            </svg>

            {/* Tooltip on hover */}
            {hoveredIndex !== null && (
                <div style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: theme.colors.background.overlay,
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.primary,
                    whiteSpace: 'nowrap',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${theme.colors.border.light}`,
                    animation: 'fadeIn 0.15s ease-out',
                    pointerEvents: 'none',
                }}>
                    {data[hoveredIndex].label}: {data[hoveredIndex].value}
                </div>
            )}
        </div>
    );
}
