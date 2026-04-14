interface ButtonProps {
  text: string;
  BackgroundColor?: string;
  TextColor?: string;
  size?: 'sm' | 'md' | 'lg';
  arrowColor: string;
  onClick?: () => void;
  disabled?:boolean;
}

const Arrow = ({ color }: { color: string }) => (
  <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
    <path d="M1.00977 7.93826L14.7329 7.80141M9.62794 1.41422L16.1509 7.9372L9.49654 14.5916" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" />
  </svg>
);

export default function Button({
  text,
  BackgroundColor,
  TextColor = '#FFFFFF',
  size = 'md',
  arrowColor,
  onClick,
  disabled
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: BackgroundColor,
        padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 32px' : '26px 50px',
        fontSize: '18px',
        color: TextColor,
        border: 'none',
        borderRadius: '18px',
        cursor: 'pointer',
        fontFamily: '"Jost", sans-serif',
        fontWeight: 600,
        lineHeight: '125%',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      {text}
      {<Arrow color={arrowColor} />}
    </button>
  );
}