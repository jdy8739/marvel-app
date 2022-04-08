import { motion } from "framer-motion";
import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    justify-content: center;
    width: 80%;
    min-width: 385px;
    max-width: 1450px;
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
    width: 225px;
    height: 275px;
    border: 1px solid black;
    border-radius: 8px;
    margin: 8px;
    cursor: pointer;
    background-position: center center;
    background-size: cover;
    background-image: linear-gradient(to top, black, transparent), url(${props => props.path});
    filter: grayscale(80%);
    transition: all 0.3s;
    &:hover {
        filter: grayscale(0%);
        transform: scale(1.01);
        border: 1px solid #F0131E;
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
    color: ${ props => props.clicked ? '#F0131E' : 'white' };
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

export const Tab = styled.button<{ clicked?: boolean }>`
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
    cursor: pointer;
    border: 1px solid transparent;
    cursor: pointer;
    &:hover {
        border: 1px solid #F0131E;
    }
`;

export const ModalBackground = styled(motion.div)`
    background-color: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
`;

export const Modal = styled(motion.div)`
    width: 400px;
    height: 520px;
    background-color: #212121;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto auto;
    border-radius: 12px;
    overflow: hidden;
`;

export const ModelImage = styled.div<{ path: string }>`
    width: 100%;
    height: 78%;
    background-image: url(${ props => props.path });
    background-position: center center;
    background-size: cover;
`;

export const ComicsFrameForm = styled.div<{ path: string }>`
    background-image: linear-gradient(to top, black, transparent), url(${ props => props.path });
    background-position: center center;
    background-size: cover;
    width: 216px;
    height: 324px;
    margin: 8px;
    filter: grayscale(30%);
    transition: all 0.3s;
    border: 1px solid rgb(0, 0, 0);
    border-radius: 8px;
    &:hover {
        filter: grayscale(0%);
        transform: scale(1.01);
        border: 1px solid #F0131E;
        ${CharName} {
            opacity: 0;
            transform: translateY(8px);
        }
    }
    position: relative;
`;

export const ClickToGoBack = styled.p`
    font-size: 15px;
    text-align: center;
    opacity: 0.3;
    position: absolute;
    top: -30px;
    left: 0;
    right: 0;
    margin: auto;
`;

export const ComicPortrait = styled.div<{ path: string }>`
    background-image: url(${ props => props.path });
    background-position: center center;
    background-size: cover;
    width: 300px;
    height: 450px;
    margin: auto;
    transition: all 1s;
    &:hover {
        transform: scale(1.02);
        ${CharName} {
            color: #F0131E;
            opacity: 1.0;
        }
        ${ClickToGoBack} {
            opacity: 0.8;
            color: #F0131E;
        }
    }
`;

export const DateChooseModal = styled.div`
    background-color: #242424;
    position: fixed;
    width: 180px;
    height: 250px;
    border-radius: 12px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto auto;
`;

export const BtnInARow = styled.div`
    width: 100%;
    text-align: right;
    margin-bottom: 4px;
`;

export const RoundPortraitName = styled.h5`
    position: absolute;
    bottom: -27px;
    left: 0;
    right: 0;
    margin: auto;
    opacity: 0.2;
    transition: all 0.3s;
`;

export const RoundPortrait = styled(motion.div)<{ path?: string }>`
    background-image: url(${ props => props.path });
    width: 105px;
    height: 105px;
    background-position: center center;
    background-size: cover;
    border-radius: 50%;
    border: 4.5px solid transparent;
    margin: 16px;
    transition: all 0.3s;
    filter: grayscale(0.9);
    cursor: pointer;
    opacity: 0.7;
    &:hover {
        border: 4.5px solid #F0131E;
        filter: grayscale(0.0);
        opacity: 1.0;
        ${RoundPortraitName} {
            opacity: 1.0;
        }
    }
    position: relative;
`;

export const CenterWord = styled.p`
    position: absolute;
    bottom: -75px;
    left: 0;
    right: 0;
    margin: auto auto;
    opacity: 0.0;
    transition: all 1s;
`;

export const RoundModal = styled(motion.div)<{ path: string }>`
    background-image: url(${ props => props.path });
    background-position: center center;
    background-size: cover;
    border-radius: 50%;
    width: 300px;
    height: 300px;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto auto;
    position: absolute;
    border: 3px solid #F0131E;
    cursor: pointer;
    &:hover {
        filter: grayscale(0.9);
        ${CenterWord} {
        opacity: 1;
    }
    }
`;

export const CharTitle = styled.h2`
    position: absolute;
    bottom: -50px;
    left: 0;
    right: 0;
    margin: auto;
`;