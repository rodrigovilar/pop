import { useState } from 'react';
import { theme } from '../styles/theme';

interface DonutChartProps {
    data: {
        label: string;
        value: number;
        color: string;
    }[];
    size?: number;
    thickness?: number;
}

export function DonutChart({ data, size = 200, thickness = 20 }: DonutChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let startAngle = 0;

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {data.map((item, index) => {
                    const percentage = item.value / total;
                    const angle = percentage * 360;
                    const radius = (size - thickness) / 2;
                    const cx = size / 2;
                    const cy = size / 2;
                    const isHovered = hoveredIndex === index;

                    // Calculate path
                    const x1 = cx + radius * Math.cos((startAngle - 90) * (Math.PI / 180));
                    const y1 = cy + radius * Math.sin((startAngle - 90) * (Math.PI / 180));

                    const endAngle = startAngle + angle;
                    const x2 = cx + radius * Math.cos((endAngle - 90) * (Math.PI / 180));
                    const y2 = cy + radius * Math.sin((endAngle - 90) * (Math.PI / 180));

                    const largeArcFlag = angle > 180 ? 1 : 0;

                    const pathData = [
                        `M ${x1} ${y1}`,
                        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    ].join(' ');

                    const segment = (
                        <path
                            key={index}
                            d={pathData}
                            fill="none"
                            stroke={item.color}
                            strokeWidth={isHovered ? thickness + 4 : thickness}
                            strokeLinecap="round"
                            style={{
                                transition: 'all 0.2s ease-out',
                                transformOrigin: 'center',
                                cursor: 'pointer',
                                filter: isHovered ? `drop-shadow(0 0 8px ${item.color})` : 'none',
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        />
                    );

                    // For full circles (100%), the arc command fails. Handle single item case.
                    if (data.length === 1 && item.value > 0) {
                        return (
                            <circle
                                key={index}
                                cx={cx}
                                cy={cy}
                                r={radius}
                                fill="none"
                                stroke={item.color}
                                strokeWidth={isHovered ? thickness + 4 : thickness}
                                style={{
                                    transition: 'all 0.2s ease-out',
                                    cursor: 'pointer',
                                    filter: isHovered ? `drop-shadow(0 0 8px ${item.color})` : 'none',
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            />
                        )
                    }

                    startAngle += angle;
                    return segment;
                })}

                {/* Center Text (Total Days) */}
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy=".3em"
                    style={{
                        fill: theme.colors.text.primary,
                        fontSize: theme.typography.fontSize['2xl'],
                        fontWeight: theme.typography.fontWeight.extrabold,
                        fontFamily: theme.typography.fontFamily.mono,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                    }}
                >
                    {total}d
                </text>
            </svg>

            {/* Tooltip on hover */}
            {hoveredIndex !== null && (
                <div style={{
                    position: 'absolute',
                    bottom: '-45px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: theme.colors.background.overlay,
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.primary,
                    whiteSpace: 'nowrap',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${theme.colors.border.light}`,
                    animation: 'fadeIn 0.15s ease-out',
                    pointerEvents: 'none',
                    boxShadow: theme.shadows.lg,
                }}>
                    <strong>{data[hoveredIndex].label}</strong>: {data[hoveredIndex].value} days
                </div>
            )}
        </div>
    );
}
