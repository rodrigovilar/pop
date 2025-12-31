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

                    // Calculate path
                    // SVG arcs are tricky. We need large-arc-flag and sweep-flag.
                    const x1 = cx + radius * Math.cos((startAngle - 90) * (Math.PI / 180));
                    const y1 = cy + radius * Math.sin((startAngle - 90) * (Math.PI / 180));

                    const endAngle = startAngle + angle;
                    const x2 = cx + radius * Math.cos((endAngle - 90) * (Math.PI / 180));
                    const y2 = cy + radius * Math.sin((endAngle - 90) * (Math.PI / 180));

                    const largeArcFlag = angle > 180 ? 1 : 0;

                    const pathData = [
                        `M ${x1} ${y1}`, // Move to start point
                        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc to end point
                        // For donut, we stroke the path, no fill.
                    ].join(' ');

                    const segment = (
                        <path
                            key={index}
                            d={pathData}
                            fill="none"
                            stroke={item.color}
                            strokeWidth={thickness}
                            strokeLinecap="round" // Optional: makes ends round, might look detached
                            style={{
                                transition: 'all 0.5s ease-out',
                                transformOrigin: 'center',
                                cursor: 'pointer',
                            }}
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
                                strokeWidth={thickness}
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
                        fontWeight: theme.typography.fontWeight.bold,
                        fontFamily: theme.typography.fontFamily.mono,
                    }}
                >
                    {total}d
                </text>
            </svg>
        </div>
    );
}
