import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apikey, BASE_URL, GET_SERIES, hash } from "../api";
import { ComicsCard } from "../styled";
import { IComics } from "../types_store/ComicsType";
import { LeftArrow, RightArrow, Wrapper } from "./CharacterComics";

interface ISeriesComics {
    id: string
    chosenComicsName: string
};

function SeriesComics({ id, chosenComicsName = "" }: ISeriesComics) {

    const [comics, setComics] = useState<IComics>();

    const [visible, setVisible] = useState(0);

    const fetchComics = () => {
        axios.get<IComics>
        (`${BASE_URL}${GET_SERIES}/${id}/comics?ts=1&apikey=${apikey}&hash=${hash}`)
            .then(res => setComics(res.data));
    };

    const findTargetIndexOfComics = () => {
        if(!chosenComicsName) setVisible(0);
        else {
            setVisible(() => 
            comics?.data.results.findIndex(comicsElem => 
                comicsElem.title === chosenComicsName) || 0)
        };
    };
    
    useEffect(() => {
        fetchComics();
    }, []);

    useEffect(() => {
        findTargetIndexOfComics();
    }, [chosenComicsName, comics]);

    const length = comics?.data.results.length || 0;

    const showPrev = () => {
        setVisible(
            visible => -- visible === -1 ? length - 1 : visible --);
    };

    const showNext = () => {
        setVisible(
            visible => ++ visible === length ? 0 : visible ++);
    };

    const nav = useNavigate();

    const [isBack, setIsBack] = useState(false);

    const SlideVariant = {
        start: (isBack: boolean) => ({
            x: isBack ? -80 : 80,
            opacity: 0,
            scale: 0.75,
            transition: {
                duration: 1
            }
        }),
        animate: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1
            }
        },
        leave: (isBack: boolean) => ({
            x: isBack ? 80 : -80,
            opacity: 0,
            scale: 0.75,
            transition: {
                duration: 1
            }
        })
    };

    return (
        <>  
            <br></br>
            <p style={{
                textAlign: 'center'
            }}
            >This series contains these comics.</p>
            <Wrapper>
                <AnimatePresence
                exitBeforeEnter
                custom={isBack}
                >
                    {
                        comics?.data.results.map((comicsElem, i) => {
                            return (
                                visible === i ? 
                                <span key={comicsElem.id}>
                                    <ComicsCard
                                    path={comicsElem.thumbnail.path + '/portrait_incredible.jpg'}
                                    variants={SlideVariant}
                                    initial="start"
                                    animate="animate"
                                    exit="leave"
                                    custom={isBack}
                                    onClick={() => nav('/comics/detail/' + comicsElem.id)}
                                    >

                                    </ComicsCard>
                                    <h4 style={{ textAlign: 'center' }}
                                    >{ comicsElem.title }</h4>
                                </span>
                                : null
                            )
                        })
                    }
                </AnimatePresence>
                <LeftArrow
                src={require('../images/arrow.png')}
                onClick={showPrev}
                />
                <RightArrow 
                src={require('../images/arrow.png')}
                onClick={showNext}
                />
            </Wrapper>
        </>
    )
};

export default SeriesComics;