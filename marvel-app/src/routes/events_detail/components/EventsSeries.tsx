import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BASE_URL, KEY_STRING } from '../../../key';
import { Blank, Loading } from '../../../styled';
import { ISeries } from '../../../types_store/SeriesType';
import { ShowMoreBtn } from '../../character_detail/components/CharacterSeries';
import EventsSeriesSlides from '../components/EventsSeriesSlides';
import React from 'react';

const SeriesFlexBox = styled.div`
	display: flex;
`;

const LIMIT = 18;

function EventSeries({ id }: { id: string }) {
	const [series, setSeries] = useState<ISeries>();

	const [offsetCnt, setOffsetCnt] = useState(0);

	const [isLoading, setIsLoading] = useState(true);

	const fetchEventSeries = () => {
		if (!isLoading) setIsLoading(true);

		axios
			.get<ISeries>(
				`${BASE_URL}events/${id}/comics?${KEY_STRING}&offset=${
					offsetCnt * LIMIT
				}&limit=${LIMIT}`,
			)
			.then(res => {
				setSeries(series => {
					if (!series) return res.data;
					else {
						const copied = { ...series };
						copied.data.results = copied.data.results.concat(
							res.data.data.results,
						);
						return copied;
					}
				});
				setIsLoading(false);
			});
	};

	const TOTAL = series?.data.total || 0;

	useEffect(() => {
		fetchEventSeries();
	}, [offsetCnt]);

	const plusOffsetCnt = () => {
		if (!checkMoreSeries()) return;
		setOffsetCnt(offsetCnt => offsetCnt + 1);
	};

	const checkMoreSeries = (): boolean => {
		if (Math.ceil(TOTAL / LIMIT) < offsetCnt + 2) {
			alert('No more to show!');
			return false;
		}
		return true;
	};

	return (
		<>
			{isLoading ? (
				<Loading src={process.env.PUBLIC_URL + '/images/giphy.gif'} />
			) : null}
			{isLoading && !series ? (
				<Loading src={process.env.PUBLIC_URL + '/images/giphy.gif'} />
			) : (
				<>
					{series?.data.results.map((seriesElem, i) => {
						return (
							<SeriesFlexBox key={i}>
								{series.data.results.length / LIMIT <=
								i ? null : (
									<EventsSeriesSlides
										slidesElements={series?.data.results.slice(
											i * LIMIT,
											i * LIMIT + LIMIT,
										)}
									/>
								)}
							</SeriesFlexBox>
						);
					})}
				</>
			)}
			<br></br>
			<br></br>
			<ShowMoreBtn onClick={plusOffsetCnt}>show more</ShowMoreBtn>
			<Blank />
		</>
	);
}

export default EventSeries;
