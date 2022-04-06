import React from "react";
import { CharacterCardForm, CharName, Highlighted } from "../styled";
import { ICharacterResult } from "../types_store/CharatersType";

function CharacterCard({ char }: { char: ICharacterResult }) {
    return (
        <>
            <CharacterCardForm
            path={`${char.thumbnail.path}/portrait_xlarge.jpg`}
            >
                <CharName 
                length={ char.name.length }
                >{ char.name }</CharName>
            </CharacterCardForm>
        </>
    )
};

export default React.memo(CharacterCard);