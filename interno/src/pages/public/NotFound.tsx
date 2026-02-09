import Button from '../../components/ui/Button';
import NotFoundImg from '../../assets/images/NotFound.png'

export default function NotFound() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 auto', width: '1200px' }}>
      <div>
        <h1 style={{fontSize:'250px', fontWeight:400, fontFamily: '"DM Serif Display", serif', color:'#CDA274'}}>404</h1>
        <p style={{fontSize:'35px', fontWeight:400, fontFamily: '"DM Serif Display", serif', marginTop:0}}> We are sorry, but the page
          you requested was not found</p>
        <Button text="Back To Home" BackgroundColor="#292F36" arrowColor="#CDA274" onClick={() => window.location.href = '/'} />
      </div>
      <img style={{width:'650px', height:'700px', borderBottomLeftRadius:'353px'}} src={NotFoundImg} alt="NotFoundImg" />
    </div>
  );
}