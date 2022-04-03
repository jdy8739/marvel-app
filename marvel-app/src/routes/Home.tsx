import axios from "axios";
import { useEffect, useState } from "react";
import { apikey, BASE_URL, GET_CHAR, hash } from "../api";
import { ICharacter } from "../types_store/CharatersType";




let cnt = 0;

const LIMIT = 30;

function Home() {

    const [chars, setChars] = useState<ICharacter>();

    const getChars = () => {
        axios.get<ICharacter>(`${BASE_URL}${GET_CHAR}&apikey=${apikey}&hash=${hash}&limit=${LIMIT}&offset=${cnt * LIMIT}`)
            .then(res => {
                setChars(res.data);
                console.log(res.data);
            });
    };

    const total = chars?.data.total;

    const showNext = () => {
        cnt ++;
        getChars();
    };

    const showPrevious = () => {
        cnt --;
        getChars();
    };

    const showFirst = () => {
        cnt = 0;
        getChars();
    };

    const showLast = () => {
        if(total) {
            const lastIndex = total / LIMIT - 1;
            cnt = lastIndex;
            getChars();
        };
    };

    const showCharsOfIndex = (idx: number) => {
        cnt = idx;
        getChars();
    };
    
    useEffect(() => {
        getChars();
    }, []);

    return (
        <>  
            {
                chars?.data.results.map(char => {
                    return (
                        <div key={char.id}>
                            <h1>{ char.name }</h1>
                            <img src={`${char.thumbnail.path}/portrait_medium.jpg`} />
                        </div>
                    )
                })
            }
            <button onClick={showFirst}>first</button>
            <button 
            onClick={showPrevious}
            disabled={cnt === 0}
            >prev</button>
            {
                [-2, -1, 0, 1, 2].map(idx => {
                    return (
                        <span key={idx}>
                            {
                                !total ? null :
                                cnt + idx < 0 ? null :
                                cnt + idx > total / LIMIT - 1 ? null :
                                <button 
                                onClick={() => showCharsOfIndex(cnt + idx)}
                                >{ cnt + idx + 1 }</button>
                            }
                        </span>
                    )
                })
            }
            <button 
            onClick={showNext}
            disabled={total ? cnt === total / LIMIT - 1 : false}
            >next</button>
            <button onClick={showLast}>last</button>
        </>
    )
};

export default Home;