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
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let startAngle = 0;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2;

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {data.map((item, index) => {
                    const percentage = item.value / total;
                    const angle = percentage * 360;

                    // For single item, just render a full circle
                    if (data.length === 1 && item.value > 0) {
                        return (
                            <circle
                                key={index}
                                cx={cx}
                                cy={cy}
                                r={radius}
                                fill={item.color}
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
                            strokeWidth={1}
                            style={{
                                transition: 'all 0.3s ease-out',
                            }}
                        />
                    );

                    startAngle += angle;
                    return segment;
                })}
            </svg>
        </div>
    );
}
