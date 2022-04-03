import styled from "styled-components";

const TitleBox = styled.div`
    position: absolute;
    h1, h3 {
        margin: 0;
    }
    h1 {
        font-size: 60px;
    }
    h3 {
        letter-spacing: 11.5px;
    }
    p {
        font-size: 12px;
    }
`;

function Home() {
    return (
        <div style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <TitleBox>
                <h1>MARVEL</h1>
                <h3>DICTIONARY</h3>
                <br></br>
                <br></br>
                <p>mady by jdy8739</p>
            </TitleBox>
        </div>
    )
};

export default Home;