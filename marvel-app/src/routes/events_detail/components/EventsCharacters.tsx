import axios from 'axios';
import { useEffect, useState } from 'react';
import {
	ICharacter,
	ICharacterResult,
} from '../../../types_store/CharatersType';
import { AnimatePresence, motion } from 'framer-motion';
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
import { ShowMoreBtn } from '../../character_detail/components/CharacterSeries';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, KEY_STRING } from '../../../key';
import React from 'react';

const LIMIT = 20;

function EventCharacters({ id }: { id: string }) {
	const [chars, setChars] = useState<ICharacter>();

	const [offsetCnt, setOffsetCnt] = useState(0);

	const [isLoading, setIsLoading] = useState(true);

	const plusOffsetCnt = () => setOffsetCnt(cnt => cnt + 1);

	useEffect(() => {
		if (isCntBeyondTotal()) {
			alert('No more to show!');
			return;
		}

		if (!isLoading) setIsLoading(true);

		axios
			.get<ICharacter>(
				`${BASE_URL}events/${id}/characters?${KEY_STRING}&offset=${
					offsetCnt * LIMIT
				}`,
			)
			.then(res => {
				setChars(chars => {
					if (!chars) return res.data;
					else {
						const copied = { ...chars };
						copied.data.results.splice(
							copied.data.results.length,
							0,
							...res.data.data.results,
						);
						return copied;
					}
				});
				setIsLoading(false);
			});
	}, [offsetCnt]);

	const isCntBeyondTotal = (): boolean => {
		const total = chars?.data.total || 999;
		if (total / LIMIT <= offsetCnt) return true;
		else return false;
	};

	const [clickedChar, setClickedChar] = useState<ICharacterResult | null>();

	const showModal = (id: number) => {
		setClickedChar(() => {
			return chars?.data.results.find(char => char.id === id);
		});
	};

	const hideModal = () => setClickedChar(null);

	const nav = useNavigate();

	return (
		<>
			{isLoading ? (
				<Loading src={process.env.PUBLIC_URL + '/images/giphy.gif'} />
			) : null}
			<Container
				style={{
					marginTop: '30px',
				}}
			>
				{isLoading && !chars ? (
					<Loading
						src={process.env.PUBLIC_URL + '/images/giphy.gif'}
					/>
				) : (
					<>
						{chars?.data.results.map(char => {
							return (
								<motion.span
									key={char.id}
									layoutId={char.id + ''}
								>
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
					</>
				)}
			</Container>
			<AnimatePresence>
				{!clickedChar ? null : (
					<ModalBackground onClick={hideModal}>
						<RoundModal
							path={
								clickedChar.thumbnail.path +
								'/standard_fantastic.jpg'
							}
							layoutId={clickedChar.id + ''}
							onClick={() =>
								nav('/characters/detail/' + clickedChar.id)
							}
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

export default EventCharacters;
