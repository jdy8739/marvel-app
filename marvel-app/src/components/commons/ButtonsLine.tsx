import React from "react";
import { Btn } from "../../styled";

interface IButtonLine {
    nowPage: number;
    TOTAL: number;
    LIMIT: number;
    // eslint-disable-next-line no-unused-vars
    moveFunction: (target: number) => void;
}

function ButtonLine({ nowPage, TOTAL, LIMIT, moveFunction }: IButtonLine) {
    return (
        <>
            {[-3, -2, -1, 0, 1, 2, 3].map(idx => {
                return (
                    <span key={idx}>
                        {0 < idx + nowPage &&
                            idx + nowPage <= Math.ceil(TOTAL / LIMIT) && (
                                <Btn
                                    onClick={() => moveFunction(idx + nowPage)}
                                    clicked={
                                        nowPage === Math.floor(+nowPage + idx)
                                    }
                                >
                                    {idx + nowPage}
                                </Btn>
                            )}
                    </span>
                );
            })}
        </>
    );
}

export default ButtonLine;
