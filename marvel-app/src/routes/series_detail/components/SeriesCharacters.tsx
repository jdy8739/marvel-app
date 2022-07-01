import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, KEY_STRING } from '../../../key';
import {
	Blank,
	CenterWord,
	CharTitle,
	Container,
	Loading,
	ModalBackground,
	RoundModal,
	RoundPortrait,
	RoundPortraitName,
} from '../../../styled';
import {
	ICharacter,
	ICharacterResult,
} from '../../../types_store/CharatersType';
import { ShowMoreBtn } from '../../character_detail/components/CharacterSeries';

type TypeCharResult = ICharacterResult | undefined;

const LIMIT = 12;

function SeriesCharacters({ id }: { id: string }) {
	const [chars, setChars] = useState<ICharacter>();

	const [offsetCnt, setOffsetCnt] = useState(0);

	const [isLoading, setIsLoading] = useState(true);

	const fetchChars = () => {
		if (!isLoading) setIsLoading(true);

		axios
			.get<ICharacter>(
				`${BASE_URL}series/${id}/characters?${KEY_STRING}&offset=${
					offsetCnt * LIMIT
				}&limit=${LIMIT}`,
			)
			.then(res => {
				setChars(chars => {
					if (!chars) return res.data;
					else {
						const copied = { ...chars };
						copied.data.results = copied.data.results.concat(
							res.data.data.results,
						);
						return copied;
					}
				});
				setIsLoading(false);
			});
	};

	useEffect(() => {
		fetchChars();
	}, [offsetCnt]);

	const [clickedChar, setClickedChar] = useState<TypeCharResult>(undefined);

	const findTargetChar = (id: number): TypeCharResult => {
		return chars?.data.results.find(char => char.id === id);
	};

	const showModal = (id: number) => {
		setClickedChar(findTargetChar(id));
	};

	const hideModal = () => setClickedChar(undefined);

	const toCharDetailPage = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		nav('/characters/detail/' + clickedChar?.id);
	};

	const plusOffsetCnt = () => {
		if (checkMoreToShow()) return;
		setOffsetCnt(offsetCnt => offsetCnt + 1);
	};

	const checkMoreToShow = (): boolean => {
		const total = chars?.data.total || 0;
		if (total / LIMIT < offsetCnt + 1) {
			alert('No more to show!');
			return true;
		}
		return false;
	};

	const nav = useNavigate();

	return (
		<>
			{isLoading ? (
				<Loading src={process.env.PUBLIC_URL + '/images/giphy.gif'} />
			) : null}
			<br></br>
			{chars?.data.results.length === 0 ? (
				<p style={{ textAlign: 'center' }}>Sorry. No data. :(</p>
			) : (
				<Container>
					{chars?.data.results.map(char => {
						return (
							<motion.span key={char.id} layoutId={char.id + ''}>
								<RoundPortrait
									path={
										char.thumbnail.path +
										'/standard_xlarge.jpg'
									}
									onClick={() => showModal(char.id)}
								>
									<RoundPortraitName>
										{char.name.split('(', 2)[0]}
									</RoundPortraitName>
								</RoundPortrait>
							</motion.span>
						);
					})}
				</Container>
			)}
			<AnimatePresence>
				{!clickedChar ? null : (
					<ModalBackground onClick={hideModal}>
						<RoundModal
							path={
								clickedChar.thumbnail.path +
								'/standard_fantastic.jpg'
							}
							onClick={toCharDetailPage}
							layoutId={clickedChar.id + ''}
						>
							<CenterWord>click to see more</CenterWord>
							<CharTitle>{clickedChar.name}</CharTitle>
						</RoundModal>
					</ModalBackground>
				)}
			</AnimatePresence>
			<br></br>
			<br></br>
			<ShowMoreBtn onClick={plusOffsetCnt}>show more</ShowMoreBtn>
			<Blank />
		</>
	);
}

export default SeriesCharacters;
