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
            <button 
            onClick={showNext}
            disabled={total ? cnt === total / LIMIT - 1 : false}
            >next</button>
            <button onClick={showLast}>last</button>
        </>
    )
};

export default Home;