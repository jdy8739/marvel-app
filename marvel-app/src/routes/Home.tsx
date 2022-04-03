import axios from "axios";
import { useEffect, useState } from "react";
import { ICharacter } from "../types_store/CharatersType";

const BASE_URL = 'http://gateway.marvel.com';

const GET_CHAR = '/v1/public/characters?ts=1'

const apikey = 'c985e750a10bc29a900a1736bc4fc93e';

const hash = 'a229262784e3a16bdc82f2bc9d49ec20';

let cnt = 0;

function Home() {

    const [chars, setChars] = useState<ICharacter>();

    const getChars = () => {
        alert(cnt);
        axios.get<ICharacter>(BASE_URL + GET_CHAR + '&apikey=' + apikey + '&hash=' + hash + '&limit=30' + `&offset=${cnt * 30}`)
            .then(res => {
                setChars(res.data);
                console.log(res.data);
                cnt ++;
            });
    }
    
    useEffect(() => {
        getChars();
    }, []);

    return (
        <>  
            <button onClick={getChars}>show more</button>
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
        </>
    )
};

export default Home;