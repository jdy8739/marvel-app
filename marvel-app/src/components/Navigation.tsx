import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
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
    width: 80%;
    max-width: 1450px;
    display: flex;
`;

const Tab = styled.p`
    padding: 15px;
`;

function Navigation() {

    const [isTop, setIsTop] = useState(true);

    const { scrollY } = useViewportScroll();

    const gradient = useTransform(
        scrollY,
        [0, 100],
        ['transparent', '#F0131E']
    );

    return (
        <>
            <Navi style={{ backgroundColor: gradient }}>
                <InnerNav>
                    <Link to={"/"}><Tab>Home</Tab></Link>
                    <Link to={"/characters"}><Tab>Characters</Tab></Link>
                    <Link to={"/comics"}><Tab>Comics</Tab></Link>
                </InnerNav>
            </Navi>
        </>
    )
};

export default Navigation;