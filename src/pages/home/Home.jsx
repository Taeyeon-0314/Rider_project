import { useState, useEffect } from "react";
import styled from "styled-components";
import Filter from "./Filter";
import { getFilterRoad } from "../../api/FilterRoadInformation";
import Search from "./Search";
import List from "./List";
import { CustomOverlayMap, Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import useGeoLocation from "../../hooks/useGeoLocation";
import useInsertFeed from "../../hooks/useInsertFeed";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import calculateTotalDistance from "../../utils/calculateTotalDistance";

const Home = () => {
  const [filterData, setFilterData] = useState([]);
  const [selectedButton, setSelectedButton] = useState("전체");
  const [searchValue, setSearchValue] = useState("");
  const [polyline, setPolyline] = useState({ roadLine: [] });
  const [totalDistance, setTotalDistance] = useState(0);
  const [mapCenter, setMapCenter] = useState({});
  const [centerCoord, setCenterCoord] = useState(null);
  const user = useUserStore((state) => state.user);

  const { mutate: insertFeed, isLoading, isError } = useInsertFeed();

  const navigate = useNavigate();
  //현위치
  const location = useGeoLocation();
  const [positions, setPositions] = useState([]);
  const [amenityDatas, setAmenityDatas] = useState([]);

  useEffect(() => {
    const getAllRoadData = async () => {
      try {
        const response = await getFilterRoad("전체");
        setFilterData(response);
      } catch (error) {
        console.error(error);
      }
    };

    getAllRoadData();
  }, []);

  useEffect(() => {
    if (polyline?.roadLine?.length > 0) {
      const totalDistance = calculateTotalDistance(polyline.roadLine);
      setTotalDistance(totalDistance);
      setMapCenter({ lat: polyline.roadLine[0].LINE_XP, lng: polyline.roadLine[0].LINE_YP });
    }
  }, [polyline]);

  // 버튼 클릭 시 현재 위치로 지도 중심 이동
  const handleCurrentLocation = () => {
    setMapCenter(location.center); // 현재 위치를 지도 중심으로 설정
  };

  const handleInsertFeed = () => {
    if (user) {
      insertFeed(polyline, {
        onSuccess: () => {
          Swal.fire({
            imageUrl: "./assets/finishImg.png",
            imageWidth: 180,
            imageHeight: 100,
            title: `
          ${polyline.BICYCLE_PATH}
          <br />
          종주점 찍기 완료`,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "피드 보러가기",
            cancelButtonText: "확인"
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/feed");
            }
          });
        },
        onError: (err) => {
          Swal.fire({
            title: "오류 발생",
            text: "종주점을 저장하는 중 오류가 발생했습니다.",
            icon: "error",
            confirmButtonText: "확인"
          });
        }
      });
    } else {
      Swal.fire({
        title: "로그인 한 유저만 가능합니다.",
        text: "로그인 후 이용해주세요.",
        confirmButtonText: "로그인 하러 가기",
        showCancelButton: true,
        cancelButtonText: "취소"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  return (
    <>
      <Container>
        <SearchFilterDiv>
          <Title>자전거 길 주변 공공 시설 검색</Title>
          <Search
            selectedButton={selectedButton}
            setFilterData={setFilterData}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          <Title>라이딩 경로 근처 공공 시설</Title>
          <Filter
            setFilterData={setFilterData}
            selectedButton={selectedButton}
            setSelectedButton={setSelectedButton}
            searchValue={searchValue}
          />
          <List
            filterData={filterData}
            setPolyline={setPolyline}
            setPositions={setPositions} //마커 좌표
            setAmenityDatas={setAmenityDatas} // 경로 편의시설 데이터
            setCenterCoord={setCenterCoord}
          />
        </SearchFilterDiv>

        <MapContainer>
          {polyline.roadLine.length === 0 ? (
            <Map
              id="map"
              // center={mapCenter.lat ? mapCenter : location.center}
              center={centerCoord ? centerCoord : location.center}
              style={{ width: "100%", height: "100%" }}
              level={polyline.roadLine.length > 0 ? 1 : 3}
            >
              <MapMarker
                position={location.center}
                image={{
                  src: "./assets/cyclist.png",
                  size: { width: 64, height: 69 },
                  options: { offset: { x: 27, y: 69 } }
                }}
              />
              {positions.map((position, index) => {
                const type = (el) => {
                  switch (el.title) {
                    case "화장실":
                      return "./assets/toiletMarker.png";
                    case "급수대":
                      return "./assets/waterSupplyMarker.png";
                    case "공기주입기":
                      return "./assets/airInjectorMarker.png";
                    case "인증센터":
                      return "./assets/certificateMarker.png";
                    default:
                      return "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
                  }
                };
                return (
                  <MapMarker
                    key={`${position.id}-${position.title}-${position.latlng.lat}-${position.latlng.lng}`}
                    position={position.latlng}
                    image={{
                      src: `${type(position)}`, // 마커이미지의 주소입니다
                      size: {
                        width: 24,
                        height: 35
                      } // 마커이미지의 크기입니다
                    }}
                    title={position.title}
                  />
                );
              })}
              <CustomOverlayMap position={location.center} yAnchor={1}>
                <CustomOverlay>
                  <span className="title">현재 위치</span>
                </CustomOverlay>
              </CustomOverlayMap>
            </Map>
          ) : (
            <Map
              id="map"
              center={mapCenter.lat ? mapCenter : location.center}
              style={{ width: "100%", height: "100%" }}
              level={polyline.roadLine.length > 0 ? 8 : 3}
            >
              <MapMarker
                position={location.center}
                image={{
                  src: "./assets/cyclist.png",
                  size: { width: 64, height: 69 },
                  options: { offset: { x: 27, y: 69 } }
                }}
              />
              <CustomOverlayMap position={location.center} yAnchor={1}>
                <CustomOverlay>
                  <span className="title">현재 위치</span>
                </CustomOverlay>
              </CustomOverlayMap>
              <MapMarker
                position={{ lat: polyline.roadLine[0].LINE_XP, lng: polyline.roadLine[0].LINE_YP }}
                image={{
                  src: "./assets/startImg.png",
                  size: { width: 64, height: 69 },
                  options: { offset: { x: 27, y: 69 } }
                }}
              />

              <CustomOverlayMap
                position={{
                  lat: polyline.roadLine[0].LINE_XP,
                  lng: polyline.roadLine[0].LINE_YP
                }}
                yAnchor={1}
              >
                <CustomOverlay>
                  <span className="title">{polyline.BICYCLE_PATH} &nbsp; 0km</span>
                </CustomOverlay>
              </CustomOverlayMap>

              <MapMarker
                position={{
                  lat: polyline.roadLine[polyline.roadLine.length - 1].LINE_XP,
                  lng: polyline.roadLine[polyline.roadLine.length - 1].LINE_YP
                }}
                image={{
                  src: "/finishImg.png",
                  size: { width: 64, height: 69 },
                  options: { offset: { x: 27, y: 69 } }
                }}
              />

              <CustomOverlayMap
                position={{
                  lat: polyline.roadLine[polyline.roadLine.length - 1].LINE_XP,
                  lng: polyline.roadLine[polyline.roadLine.length - 1].LINE_YP
                }}
                yAnchor={1}
              >
                <CustomOverlay>
                  <span className="title">
                    {polyline.BICYCLE_PATH} &nbsp;
                    {totalDistance}km <br />
                    {user ? (
                      <FeedButton onClick={() => handleInsertFeed()}>
                        {isLoading ? "저장 중..." : "종주점 찍기"}
                      </FeedButton>
                    ) : null}
                  </span>
                </CustomOverlay>
              </CustomOverlayMap>
              <Polyline
                path={polyline.roadLine.map((point) => ({
                  lat: point.LINE_XP,
                  lng: point.LINE_YP
                }))}
                strokeWeight={5}
                strokeColor={"#ff0000"}
                strokeOpacity={0.7}
                strokeStyle={"solid"}
              />
              {amenityDatas.map((el, index) => {
                const type = (el) => {
                  switch (el.Classification) {
                    case "화장실":
                      return "./assets/toiletMarker.png";
                    case "급수대":
                      return "./assets/waterSupplyMarker.png";
                    case "공기주입기":
                      return "./assets/airInjectorMarker.png";
                    case "인증센터":
                      return "./assets/certificateMarker.png";
                    default:
                      return "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
                  }
                };

                return (
                  <MapMarker
                    key={`${el.name}${el.id}-${el.latitude}-${el.longitude}`}
                    position={{ lat: el.latitude, lng: el.longitude }}
                    image={{
                      src: `${type(el)}`, // 마커이미지의 주소입니다
                      size: {
                        width: 30,
                        height: 30
                      } // 마커이미지의 크기입니다
                    }}
                    title={el.name}
                  />
                );
              })}
            </Map>
          )}
        </MapContainer>
      </Container>
      <CurrentLocation>
        <CurrentLocationButton onClick={() => handleCurrentLocation()}>
          <CurrentLocationImg src="/currentLocation.png" alt="location" />
        </CurrentLocationButton>
      </CurrentLocation>
    </>
  );
};

const FeedButton = styled.button`
  border: 1px solid #ffffff;
  border-radius: 5px;
  padding: 5px 10px;
  margin-top: 10px;
  font-size: 16px;
  background: none;
  color: #ffffff;
  cursor: pointer;
`;

const CurrentLocationButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
`;
const CurrentLocationImg = styled.img`
  width: 50px;
  height: 50px;
`;
const CurrentLocation = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
`;

const Container = styled.div`
  background-color: #121212;
  /* min-height: 100vh; */
  display: flex;
  /* gap: 20px; */
  width: 100%;
  /* height: 100%; */
  height: 93vh;

  /* height: 70%; */
  /* margin: 20px auto; */
  /* padding: 20px; */
`;

const Title = styled.div`
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
  margin-top: 10px;
  text-align: left;
  width: 100%;
`;

const SearchFilterDiv = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* max-height: 100%; */
  /* min-height: 100vh; */
  height: 93vh;

  width: 23%;
  /* height: 100%; */
  border-radius: 10px;
  background: linear-gradient(180deg, #667386 0%, #030303 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
`;

const MapContainer = styled.div`
  width: 77%;
  /* height: 960vh; */
  height: 93vh;
  /* max-height: 960px; */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CustomOverlay = styled.div`
  position: relative;
  bottom: 85px;
  border-radius: 20px;
  border: 1px solid #ccc;
  border-bottom: 2px solid #ddd;
  float: left;

  &:nth-of-type(n) {
    border: 0;
    /* box-shadow: 0px 1px 2px #888; */
  }

  .title {
    display: block;
    text-align: center;
    border-radius: 20px;
    color: #ffffff;
    background: #000000;
    margin-right: 35px;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: bold;
  }

  &:after {
    content: "";
    position: absolute;
    margin-left: -12px;
    left: 50%;
    bottom: -12px;
    width: 22px;
    height: 12px;
    background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png");
  }
`;

export default Home;
