import EventContents from './EventContents';

const SELECT_OPTION = [
  { value: 'ADMIN_SETTING', label: '추천순' },
  { value: 'BEST_SELLER', label: '판매량순' },
  { value: 'BEST_REVIEW', label: '상품리뷰순' },
];

const EventPage = () => <EventContents sortBy={SELECT_OPTION} />;

export default EventPage;
