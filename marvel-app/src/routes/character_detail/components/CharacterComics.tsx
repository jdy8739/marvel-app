import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BASE_URL, KEY_STRING } from '../../../key';
import {
	Blank,
	Btn,
	ComicsCard,
	Highlighted,
	Input,
	Loading,
} from '../../../styled';
import { IComics } from '../../../types_store/ComicsType';

export const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	max-width: 750px;
	min-width: 300px;
	margin: auto;
`;

export const LeftArrow = styled.img`
	position: absolute;
	left: 0;
	transform: rotateY(180deg);
	width: 40px;
	height: 50px;
	cursor: pointer;
	opacity: 0.3;
	&:hover {
		opacity: 0.7;
	}
`;

export const RightArrow = styled.img`
	position: absolute;
	right: 0;
	width: 40px;
	height: 50px;
	cursor: pointer;
	opacity: 0.3;
	&:hover {
		opacity: 0.7;
	}
`;

let offsetCnt = 0;

const LIMIT = 12;

function CharacterComics({ id }: { id: string }) {
	const [comics, setComics] = useState<IComics>();

	const [isLoading, setIsLoading] = useState(true);

	const fetchComicsContainingCharacter = () => {
		if (!isLoading) channgeIsLoadingStatus();
		axios
			.get(
				`${BASE_URL}characters/${id}/comics?${KEY_STRING}&limit=${LIMIT}
            &offset=${offsetCnt * LIMIT}`,
			)
			.then(res => {
				setComics(comics => {
					if (!comics) return res.data;
					else {
						const copied = { ...comics };
						copied.data.results.splice(
							copied.data.results.length,
							0,
							...res.data.data.results,
						);
						return copied;
					}
				});
				channgeIsLoadingStatus();
			});
	};

	const total = comics?.data.total || 0;

	useEffect(() => {
		fetchComicsContainingCharacter();
	}, []);

	const channgeIsLoadingStatus = () => setIsLoading(now => !now);

	const [visible, setVisible] = useState(0);

	const showPrev = () => {
		setIsBack(true);
		setVisible(visible => {
			if (comics?.data.results) {
				return visible - 1 < 0
					? comics.data.results.length - 1
					: visible - 1;
			} else return 0;
		});
	};

	const showNext = () => {
		setIsBack(false);
		setVisible(visible => {
			if (comics?.data.results) {
				const nowTotal = comics.data.results.length;
				if (visible + 1 === nowTotal && nowTotal < total) {
					const confirm = window.confirm(
						'Data has reached limit. Want fetch more?',
					);
					if (confirm) {
						offsetCnt++;
						fetchComicsContainingCharacter();
						return visible + 1;
					}
				}
				return visible + 1 === nowTotal ? 0 : visible + 1;
			} else return 0;
		});
	};

	useEffect(() => {
		return () => {
			offsetCnt = 0;
		};
	}, []);

	const [isBack, setIsBack] = useState(false);

	const SlideVariant = {
		start: (isBack: boolean) => ({
			x: isBack ? -80 : 80,
			opacity: 0,
			scale: 0.75,
			transition: {
				duration: 1,
			},
		}),
		animate: {
			x: 0,
			opacity: 1,
			scale: 1,
			transition: {
				duration: 1,
			},
		},
		leave: (isBack: boolean) => ({
			x: isBack ? 80 : -80,
			opacity: 0,
			scale: 0.75,
			transition: {
				duration: 1,
			},
		}),
	};

	const [dateFrom, setDateFrom] = useState('');

	const [dateTo, setDateTo] = useState('');

	const handleDateFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDateFrom(e.currentTarget.value);
	};

	const handleDateTo = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDateTo(e.currentTarget.value);
	};

	const handleDateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!dateFrom || dateFrom >= dateTo) {
			alert('Please check the date. :(');
			return;
		}

		if (!isLoading) channgeIsLoadingStatus();

		axios
			.get<IComics>(
				`${BASE_URL}characters/${id}/comics?${KEY_STRING}&limit=12&dateRange=${dateFrom},${dateTo}`,
			)
			.then(res => {
				setComics(res.data);
				channgeIsLoadingStatus();
			});
	};

	const nav = useNavigate();

	return (
		<>
			{isLoading ? <Loading src={'/images/giphy.gif'} /> : null}
			{comics?.data.results.length === 0 ? (
				<p style={{ textAlign: 'center' }}>cannot find any data :(</p>
			) : (
				<>
					<p
						style={{
							textAlign: 'center',
						}}
					>
						This character is contained in these comics.
					</p>
					<Wrapper>
						<AnimatePresence exitBeforeEnter custom={isBack}>
							{comics?.data.results.map((comic, i) => {
								return visible === i ? (
									<span key={comic.id}>
										<ComicsCard
											path={`${comic.thumbnail.path}/portrait_incredible.jpg`}
											variants={SlideVariant}
											initial="start"
											animate="animate"
											exit="leave"
											custom={isBack}
											onClick={() =>
												nav(
													'/comics/detail/' +
														comic.id,
												)
											}
										></ComicsCard>
										<div
											style={{
												textAlign: 'center',
											}}
										>
											<h4>{comic.title}</h4>
											<span>
												<Highlighted>
													{visible + 1}
												</Highlighted>
												{' / ' +
													comics?.data.results.length}
											</span>
										</div>
									</span>
								) : null;
							})}
						</AnimatePresence>
						<LeftArrow
							src={process.env.PUBLIC_URL + '/images/arrow.png'}
							onClick={showPrev}
						/>
						<RightArrow
							src={process.env.PUBLIC_URL + '/images/arrow.png'}
							onClick={showNext}
						/>
					</Wrapper>
				</>
			)}
			<div
				style={{
					textAlign: 'center',
				}}
			>
				<br></br>
				<br></br>
				<p>Find by date if there are no data you find above.</p>
				<form onSubmit={handleDateSubmit}>
					<label>
						<span>from </span>
						<Input type="date" onChange={handleDateFrom} />
					</label>
					&ensp;
					<label>
						<span>to </span>
						<Input type="date" onChange={handleDateTo} />
					</label>
					&ensp;
					<Btn>search</Btn>
				</form>
			</div>

			<Blank />
		</>
	);
}

export default CharacterComics;
