import { useNavigate } from "react-router-dom";
import { CharName, ComicsFrameForm } from "../../styled";
import { Result } from "../../types_store/ComicsType";

function ComicsCard({ comic, index }: { comic: Result, index: number }) {
    const nav = useNavigate();
    const toComicsDetailPage = (id: number) => nav(`/comics/detail/${id}`);
    const cardVariant = {
		initial: {
			opacity: 0,
            y: -20
		},
		animate: {
			opacity: 1,
            y: 0,
			transition: {
				duration: 1 + 0.2 * index,
                type: 'spring'
			},
		},
		exit: {
			opacity: 0,
		},
	};
    return (
        <ComicsFrameForm
            key={comic.id}
            variants={cardVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            path={
                comic.thumbnail.path +
                "/portrait_incredible.jpg"
            }
            onClick={() => toComicsDetailPage(comic.id)}
        >
            <CharName length={comic.title.length}>
                {comic.title.length > 20
                    ? comic.title.slice(0, 20) + "..."
                    : comic.title}
            </CharName>
        </ComicsFrameForm>
    );
}

export default ComicsCard;