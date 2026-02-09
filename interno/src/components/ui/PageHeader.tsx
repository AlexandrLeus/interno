interface PageHeaderProps {
    text: string;
    imageUrl: string;
}

export default function PageHeader({
    text,
    imageUrl,
}: PageHeaderProps) {
    return (<div style={{
        backgroundImage: `url(${imageUrl})`,
        maxWidth: '1920px',
        margin: '0 auto 100px',
        height: '356px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'end',
        backgroundPosition: 'center'
    }}>
        <div style={{
            backgroundColor: '#FFF',
            width: '503px',
            height: '178px',
            borderTopLeftRadius: '37px',
            borderTopRightRadius: '37px',
            textAlign: 'center',
            alignContent: 'center'
        }}>
            <h1 className='title'>{text}</h1>
        </div>
    </div>);
}
