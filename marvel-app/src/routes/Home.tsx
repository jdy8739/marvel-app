import axios from "axios";
import { useEffect, useState } from "react";
import { apikey, BASE_URL, GET_CHAR, hash } from "../api";
import { ICharacter } from "../types_store/CharatersType";




let cnt = 0;

const LIMIT = 30;

function Home() {

    const [chars, setChars] = useState<ICharacter>();

    const getChars = () => {
        axios.get<ICharacter>(`${BASE_URL}${GET_CHAR}&apikey=${apikey}&hash=${hash}&limit=${LIMIT}&offset=${cnt * 30}`)
            .then(res => {
                setChars(res.data);
                console.log(res.data);
            });
    };

    const showNext = () => {
        cnt ++;
        getChars();
    };

    const showPrevious = () => {
        cnt --;
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
            <button onClick={showNext}>next</button>
            <button onClick={showPrevious}>prev</button>
        </>
    )
};

export default Home;