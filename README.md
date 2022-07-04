# marvel-app

포트폴리오용으로 제작한 '마블 백과사전' 토이 프로젝트입니다.

프론트엔드 뷰는 cra typescript로 제작하였으며,

서버 백엔드는 마블 공식 사이트에서 무료로 운영하는 marvel developer api 서버를 활용하였습니다.



주 사용 라이브러리로는 recoil, react-query, framer-motion, styled-components를 사용하였습니다.

recoil은 redux-toolkit보다 데이터의 정보량이 적은 여러개의 변수를 쉽게 관리할 수 있다는 이점에서 상태관리 라이브러리로써 사용하였습니다.

또한, 서버가 해외에 존재하며 클릭 한 번에 많은 양의 api정보를 fetch하게되는 사이트 특성 상

불필요한 재렌더링을 방지하고 일정 시간동안 한 번 받아온 api정보를 캐싱해주는 react-query 라이브러리를 함께 사용해 부정적인 사용자 경험을 최소화하도록했습니다.

그리고 슬라이드, 캐러샐, 팝업 모달 등의 화면 움직임을 구현하기 위해 framer-motion 라이브러리를 사용하였습니다.

물론 일반 자바스크립트의 기능을 사용하여 위의 기능들을 구현가능하지만 framer-motion은 css가 아닌, 트랜지션의 상태를 객체 변수로서 선언하고

이를 움직임을 주고자하는 tag에 props로 전송하는것으로 쉽고 효율적인 개발이 가능하여 이 라이브러리를 사용했습니다.



결과물은 githup pages에 배포하여 밑의 주소에서 확인하실 수 있습니다.

#### https://jdy8739.github.io/marvel-app/

아래는 marvel developer 주소입니다. 해당 사이트에서 제공하는 api를 활용했습니다.

#### https://developer.marvel.com

감사합니다.






