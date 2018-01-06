# os-who-client
누굴까


## Introduction

os who android-ios mobile app

## Tech Stack

* environment: Node.js v7.10.1
* package manager: npm, yarn, rnpm
* front-end framework: React-native
* Store: Mobx
* linters: X
* compilers: Babel
* unit testing frameworks: X
* version control system: Git

# packages

* base/ : 네트워크 및 GPL 쿼리, Firebase 내용이 들어가는 패키지.
* component/ : 하위 컴포넌트의 집합. 다만 후반기 개발내용에는 거의 들어가지 않고 개발됨
* config/ : 설정 또한 .. 그냥 사용되니 config-dev 파일을 수정하자.
* images/ : 사용되는 이미지 셋
* layouts/ : 모든 화면 레이아웃이 들어가있는 패키지
* lib/ : 사용되지 않음
* routes/ : 라우터
* stores/ : 스토어. 상태관리에 사용되며 ChatListStore 에 모든 것이 들어간다.
* utils/ : Alert, Payment 유틸 파일의 집합

# Description

Rx, Mobx, React native 가 사용된 프로젝트.  
Mobx의 경우 늦게 도입이 되었기때문에 일반 State 기반으로 되어있는 코드가 상당수.  
상태 업데이트가 안된다고 하자보수가 올라오는 경우 대부분 State로 되어있는 부분일테니,  
Mobx로 이관하여 처리한다면 쉽게 처리가 가능할 것이다.  

프로젝트 자체에 대해 궁금한 내용은 구글드라이브의 누굴까 스토리보드를 확인하는 것이 빠름.  

현재 코드의 상태가.. 상당히 좋지 않다.
React native 를 첫 시험도입하며 진행했던 것이라 더 심하다.

대부분의 코드는 app/layout 폴더 하단에 각각 레이아웃 파일에 모두 들어가있어,
이해하기는 어렵지 않을 것이다.

iOS 의 경우 인앱빌링 제품명이 아직 확정나지 않았고, 앱스토어에 올라가지 않은 상황이라,
이부분에대한 추가 처리가 필요할 것으로 보인다. ( 올라가는 것이 확정되면 )

결제에 관한 부분은 utils/Payment 를 참고하면 된다.

# Install

#### Android

#### iOS
기본적으로 X-code 설치가 되어있어야함
다음 명령어로 cocoapads 설치
```
gem install cocoapods
pod setup
pod upgrade
```

{root_directory}/ios 로 이동하여 다음 명령어를 실행하여 프로젝트 실행에 필요한 의존성을 설치
```
pod install
```

# Commands

* dev server-start : react-native start
* start : react-native run-android / run-ios
* release-build : cd android && ./gradlew clean , ./gradlew assembleRelease

릴리즈 빌드가 항상 문제.
리액트 네이티브의 고질적 문제로 보임.
클린 후 첫 빌드는 항상 실패함.
근데 같은 커맨드로 다시 빌드를 해보면 성공함.
증분빌드의 문제인가 추측해본다.


## 에러

실행시 에러가 나는 경우 다음과 같이 대응.

* 권한이 없는 문제
```
chmod +x gradlew
```
gradlew에 대한 권한을 갖고있어야 실행이 되므로 권한을 부여

* 실행하려는 앱 버전이 낮은경우
이미 앱이 설치되어있는 경우 빌드하려는 버전이 설치된 버전보다 낮으면 에러가 난다.
```
삭제하고 다시 설치
```

* 개복치... ㅂㄷㅂㄷ
그냥 죽는다...


