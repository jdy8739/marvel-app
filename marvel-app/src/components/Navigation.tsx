import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useMatch } from "react-router-dom";
import styled from "styled-components";

const Navi = styled(motion.div)`
    width: 100vw;
    height: 75px;
    margin-bottom: 100px;
    position: fixed;
    top: 0;
    z-index: 99;
    box-shadow: 12px 12px 12px 0px #00000033;
    transition: all 1s;
    border-bottom: 2px solid #F0131E;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const InnerNav = styled.div`
    width: 85%;
    max-width: 1950px;
    display: flex;
`;

const Tab = styled.p<{ clicked?: boolean, istop: boolean }>`
    padding: 15px;
    color: ${props => 
    props.clicked && props.istop ? 'red' : props.clicked && !props.istop ? 'black' : 'white' };
    &:hover {
        color: ${props => 
    !props.clicked && !props.istop ? 'black' : 
    !props.clicked && props.istop ? 'red' : 
    props.clicked && props.istop ? 'red' : 'white'};
    }
    font-weight: bold;
`;

function Navigation() {

    const { scrollY } = useViewportScroll();

    const gradient = useTransform(
        scrollY,
        [0, 100],
        ['rgba(0, 0, 0, 0.5)', '#F0131E']
    );

    const homeMatch = useMatch('/');

    const charMatch = useMatch('/characters/*');

    const comicsMatch = useMatch('/comics/*');

    const seriesMatch = useMatch('/series/*');

    const eventsMatch = useMatch('/events/*');

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => 
            window.removeEventListener('scroll', handleScroll);
    }, []);

    const [isTop, setIsTop] = useState(true);

    const handleScroll = () => {
        if(document.documentElement.scrollTop > 0 && isTop) {
            setIsTop(false);
        } else if(document.documentElement.scrollTop === 0) {
            setIsTop(true);
        };
    };

    return (
        <>  
            <Navi style={{ backgroundColor: gradient }}>
                <InnerNav>
                    <Link to={"/"}>
                        <Tab
                        istop={isTop}
                        clicked={Boolean(homeMatch)}
                        >Home</Tab>
                    </Link>
                    <Link to={"/characters"}>
                        <Tab
                        istop={isTop}
                        clicked={Boolean(charMatch)}
                        >Characters</Tab>
                    </Link>
                    <Link to={"/comics"}>
                        <Tab
                        istop={isTop}
                        clicked={Boolean(comicsMatch)}
                        >Comics</Tab>
                    </Link>
                    <Link to={"/series"}>
                        <Tab
                        istop={isTop}
                        clicked={Boolean(seriesMatch)}
                        >Series</Tab>
                    </Link>
                    <Link to={"/events"}>
                        <Tab
                        istop={isTop}
                        clicked={Boolean(eventsMatch)}
                        >Events</Tab>
                    </Link>
                    <p style={{ flexGrow: 1 }}></p>
                    <Link to={"/#"}>
                        <Tab
                        istop={isTop}
                        >Portfilio</Tab>
                    </Link>
                </InnerNav>
            </Navi>
        </>
    )
};

export default Navigation;