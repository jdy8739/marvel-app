import { motion } from "framer-motion";
import styled from "styled-components";

export const CharacterContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    justify-content: center;
    width: 80%;
    margin: auto;
`;

export const CharName = styled.h1<{ length: number }>`
    position: absolute;
    bottom: 12px;
    right: 0;
    left: 0;
    margin: auto;
    opacity: 0.5;
    transition: all 1s;
    font-size: ${ props => props.length > 12 ? '15px' : '18px' };
`;

export const CharacterCardForm = styled.div<{ path: string }>`
    padding: 1px;
    width: 225px;
    height: 275px;
    border: 1px solid #F0131E;
    border-radius: 8px;
    margin: 8px 12px;
    cursor: pointer;
    background-position: center center;
    background-size: cover;
    background-image: linear-gradient(to top, black, transparent), url(${props => props.path});
    filter: grayscale(80%);
    transition: all 0.3s;
    &:hover {
        filter: grayscale(0%);
        transform: scale(1.01);
        ${CharName} {
            opacity: 0;
            transform: translateY(8px);
        }
    }
    position: relative;
`;

export const Highlighted = styled.span`
    color: #F0131E;
    font-weight: bold;
`;

export const Btn = styled.button<{ clicked?: boolean }>`
    border: 1px solid ${ props => props.clicked ? 'white' : '#F0131E' };
    margin: 4px;
    background-color: ${ props => props.clicked ? 'white' : 'transparent' };;
    color: white;
    padding: 4px 8px;
    cursor: pointer;
`;

export const Input = styled.input`
    background-color: transparent;
    border: 1px solid #F0131E;
    color: white;
    padding: 4.2px;
`;

export const Blank = styled.div`
    height: 150px;
`;

export const Tabs = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 50px;
`;

export const Tab = styled.button<{ clicked: boolean }>`
    margin: 24px;
    cursor: pointer;
    border: 1px solid #F0131E;
    border-radius: 8px;
    background-color: ${ props => props.clicked ? '#F0131E' : 'transparent' };
    color: white;
    padding: 8px 12px;
    transition: all 1s;
    &:hover {
        background-color: white;
        color: #F0131E;
    }
`;

export const ComicsCard = styled(motion.div)<{ path: string }>`
    width: 320px;
    height: 480px;
    background-position: center center;
    background-size: cover;
    background-image: url(${ props => props.path });
    margin: auto;
`;

export const ModalBackground = styled.div`
    background-color: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
`;

export const Modal = styled(motion.div)`
    width: 400px;
    height: 400px;
    background-color: #212121;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto auto;
    border-radius: 12px;
`;
