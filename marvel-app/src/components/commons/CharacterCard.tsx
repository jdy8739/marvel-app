import React from "react";
import { CharacterCardForm, CharName } from "../../styled";
import { ICharacterResult } from "../../types_store/CharatersType";

function CharacterCard({ char, index }: { char: ICharacterResult, index: number }) {
    const cardVariant = {
		initial: {
			opacity: 0,
		},
		animate: {
			opacity: 1,
			transition: {
				duration: 1 + 0.1 * index,
			},
		},
		exit: {
			opacity: 0,
		},
	};
    return (
        <>
            <CharacterCardForm
                path={`${char.thumbnail.path}/portrait_xlarge.jpg`}
                variants={cardVariant}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <CharName length={char.name.length}>{char.name}</CharName>
            </CharacterCardForm>
        </>
    );
}

export default React.memo(CharacterCard);