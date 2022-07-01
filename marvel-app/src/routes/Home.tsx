import styled from "styled-components";
import { Helmet } from "react-helmet"

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
    animation: show 3s;
    @keyframes show {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
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
            <Helmet>
                <title>Marvel Dictionary</title>
            </Helmet>
            <TitleBox>
                <h1>MARVEL</h1>
                <h3>DICTIONARY</h3>
                <br></br>
                <br></br>
                <p>made by Do Young Chung</p>
            </TitleBox>
        </div>
    )
};

export default Home;