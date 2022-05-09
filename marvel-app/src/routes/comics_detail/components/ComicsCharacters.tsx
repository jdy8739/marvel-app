import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apikey, BASE_URL, GET_ON_COMICS, hash } from "../../../api";
import { CharTitle, CenterWord, Container, ModalBackground, RoundModal, RoundPortrait, RoundPortraitName, Blank, Loading } from "../../../styled";
import { ICharacterResult, ICharacter } from "../../../types_store/CharatersType";

type TypeCharResult = ICharacterResult | undefined;

function ComicsCharacters({ id }: { id: string }) {

    const [chars, setChars] = useState<ICharacter>();

    const [isLoading, setIsLoading] = useState(true);

    const fetchCharactersInThisComic = () => {
        axios.get<ICharacter>(`${BASE_URL}${GET_ON_COMICS}/${id}/characters?ts=1&apikey=${apikey}&hash=${hash}`)
            .then(res => {
                setChars(res.data);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchCharactersInThisComic();
    }, []);

    const [clickedChar, setClickedChar] = useState<TypeCharResult>(undefined);

    const showModal = (id: number) => {
        setClickedChar(findTargetChar(id));
    };

    const hideModal = () => {
        setClickedChar(undefined);
    };

    const findTargetChar = (id: number) :TypeCharResult => {
        return chars?.data.results.find(char => char.id === id);
    };

    const nav = useNavigate();

    return (
        <>
            { isLoading ? <Loading src={require('../../../images/giphy.gif')}/> : null }
            <Container>
                {
                    chars?.data.results.length === 0 ? 
                    <p>Sorry. No data. :(</p> :
                    <>
                        {
                            chars?.data.results.map(char => {
                                return (
                                    <motion.span 
                                    key={char.id}
                                    layoutId={char.id + ''}
                                    >
                                        {
                                            clickedChar?.id === char.id ? 
                                            <RoundPortrait /> :
                                            <RoundPortrait
                                            path={char.thumbnail.path + "/standard_xlarge.jpg"}
                                            onClick={() => showModal(char.id)}
                                            >
                                                <RoundPortraitName>{ char.name.split('(', 2)[0] }</RoundPortraitName>
                                            </RoundPortrait>
                                        }
                                    </motion.span>
                                )
                            })
                        }
                    </>
                }
                <AnimatePresence>
                    {
                        !clickedChar ? null :
                            <ModalBackground
                            onClick={hideModal}
                            >
                                <RoundModal 
                                path={clickedChar.thumbnail.path + '/standard_fantastic.jpg'}
                                layoutId={clickedChar.id + ''}
                                onClick={() => nav('/characters/detail/' + clickedChar.id)}
                                >   
                                    <CenterWord>click to see more</CenterWord>
                                    <CharTitle>{ clickedChar.name }</CharTitle>
                                </RoundModal>
                        </ModalBackground>
                    }
                </AnimatePresence>
            </Container>
            <Blank />
        </>
    )
};

export default ComicsCharacters;