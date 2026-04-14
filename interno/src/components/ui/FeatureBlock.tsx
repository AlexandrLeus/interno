import Button from "./Button";

interface FeatureBlockProps {
  title: string;
  text: string;
  imageUrl: string;
  imagePosition: 'left' | 'right';
  buttonText: string;
}

export default function FeatureBlock({
  title,
  text,
  imageUrl,
  imagePosition,
  buttonText,
}: FeatureBlockProps) {

  const isImageLeft = imagePosition === 'left';

  return (
    <div style={{
      display: 'flex',
      flexDirection: isImageLeft ? 'row' : 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '1200px',
      margin: '0 auto',
      paddingBottom: '150px'
    }}>
      <img
        src={imageUrl}
        alt={title}
        style={{ width: '660px', borderRadius: '70px' }}
      />
      <div style={{ width: '500px' }}>
        <h1 className='title'>{title}</h1>
        <p style={{
          fontFamily: '"Jost", sans-serif',
          color: 'var(--text-secondary)',
          fontSize: '22px',
          fontWeight: 400
        }}> {text}</p>
        <Button text={buttonText} arrowColor="#CDA274"/>
      </div>

    </div>
  );
}