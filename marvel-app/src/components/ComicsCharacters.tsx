import axios from "axios";
import { useEffect, useState } from "react";
import { apikey, BASE_URL, GET_ON_COMICS, hash } from "../api";
import { Container, RoundPortrait, RoundPortraitName } from "../styled";
import { ICharacter } from "../types_store/CharatersType";

function ComicsCharacters({ id }: { id: string }) {

    const [chars, setChars] = useState<ICharacter>();

    const fetchCharactersInThisComic = () => {
        axios.get<ICharacter>(`${BASE_URL}${GET_ON_COMICS}/${id}/characters?ts=1&apikey=${apikey}&hash=${hash}`)
            .then(res => {
                setChars(res.data);
            });
    };

    useEffect(() => {
        fetchCharactersInThisComic();
    }, []);

    return (
        <>
            <Container>
                {
                    chars?.data.results.length === 0 ? 
                    <p>Sorry. No data. :(</p> :
                    <>
                        {
                            chars?.data.results.map(char => {
                                return (
                                    <RoundPortrait 
                                    key={char.id}
                                    path={char.thumbnail.path + "/standard_xlarge.jpg"}
                                    >
                                        <RoundPortraitName>{ char.name.split('(', 2)[0] }</RoundPortraitName>
                                    </RoundPortrait>
                                )
                            })
                        }
                    </>
                }
            </Container>
        </>
    )
};

export default ComicsCharacters;