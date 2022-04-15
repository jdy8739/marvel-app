import axios from "axios";
import { useEffect, useState } from "react";
import { apikey, BASE_URL, GET_EVENTS, hash } from "../api";
import { ICharacter } from "../types_store/CharatersType";
import { AnimatePresence, motion } from "framer-motion";
import { Container, RoundPortrait, RoundPortraitName } from "../styled";
import { ShowMoreBtn } from "./CharacterSeries";

const LIMIT = 20;

function EventCharacters({ id }: { id: string }) {

    const [chars, setChars] = useState<ICharacter>();

    const [offsetCnt, setOffsetCnt] = useState(0);

    const plusOffsetCnt = () => setOffsetCnt(cnt => cnt + 1);

    useEffect(() => {
        if(isCntBeyondTotal()) {
            alert('No to show more!');
            return;
        };
        axios.get<ICharacter>(
            `${BASE_URL}${GET_EVENTS}/${id}/characters?ts=1&apikey=${apikey}&hash=${hash
            }&offset=${offsetCnt * LIMIT}&limit=${offsetCnt * LIMIT + LIMIT}`)
            .then(res => {
                setChars(chars => {
                    if(!chars) return res.data;
                    else {
                        const copied = {...chars};
                        copied.data.results.splice(
                            copied.data.results.length, 0, ...res.data.data.results);
                        return copied;
                    };
                });
            });
    }, [offsetCnt]);

    const isCntBeyondTotal = () :boolean => {
        const total = chars?.data.total || 999;
        if(total / LIMIT <= offsetCnt) return true;
        else return false;
    };

    return (
        <>  
            <Container style={{
                marginTop: '30px'
            }}>
                {
                    chars?.data.results.map(char => {
                        return (
                            <motion.span 
                            key={char.id}
                            layoutId={char.id + ''}
                            >
                                <RoundPortrait
                                path={char.thumbnail.path + "/standard_xlarge.jpg"}
                                >
                                    <RoundPortraitName>{ char.name.split('(', 2)[0] }</RoundPortraitName>
                                </RoundPortrait>
                                
                            </motion.span>
                        )
                    })
                }
            </Container>
            <br></br>
            <br></br>
            <ShowMoreBtn onClick={plusOffsetCnt}>show more</ShowMoreBtn>
        </>
    )
};

export default EventCharacters;