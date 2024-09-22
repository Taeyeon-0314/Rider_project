import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Pagination from "./Pagination";
import { getAmenities } from "../../api/FilterRoadInformation";
import informationInstance from "../../axiosInstance/information";

const List = ({ filterData, setPolyline, setPositions, setAmenityDatas, setCenterCoord }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_ITEMS = 5;
  const PAGE_GROUP = 5;
  const [address, setAddress] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const indexOfLastItem = currentPage * PAGE_ITEMS;
  const indexOfFirstItem = indexOfLastItem - PAGE_ITEMS;
  const currentItems = filterData.slice(indexOfFirstItem, indexOfLastItem);

  const getRoadPath = async (data) => {
    let result;
    const bicycle_road = await informationInstance.get(`/bicycle_road`);
    const amenities = await informationInstance.get(`/amenities`);
    data.ROAD_SN
      ? (result = bicycle_road.data.find((el) => el.ROAD_SN === data.ROAD_SN))
      : (result = amenities.data.find((el) => el.id === data.id));
    if (result.roadLine) {
      setPolyline(result);
      const name = await result.BICYCLE_PATH.slice(0, 2);
      const amenitiesData = await informationInstance.get(`/amenities?name_like=${name}`);

      setAmenityDatas(amenitiesData.data);
    }
    return result;
  };

  //현재결과 좌표 positions state에 저장
  useEffect(() => {
    const fetchCurrentItems = async () => {
      const result = await Promise.all(
        currentItems
          .filter((el) => {
            return !el.BICYCLE_PATH;
          })
          .map((el) => getRoadPath(el))
      );
      const marker = result.map((el) => {
        return { title: el.Classification, latlng: { lat: el.latitude, lng: el.longitude } };
      });
      setPositions(marker);
    };
    const getAllRoadData = async () => {
      for (const item of currentItems) {
        if (item.id && !address[item.id]) {
          // 이미 주소가 있으면 요청하지 않도록 조건 추가
          try {
            setIsLoading(true);
            const amenities = await getAmenities(item.id);
            const mergedData = { ...amenities.data[0], ...item };
            if (mergedData.longitude && mergedData.latitude) {
              getAddressFromCoords(mergedData.latitude, mergedData.longitude, mergedData.id, mergedData);
            }
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }
      }
    };
    const getAddressFromCoords = (lat, lng, id) => {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.coord2Address(lng, lat, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const addr = result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;

          // address 상태에 병합된 데이터의 주소를 저장
          setAddress((prev) => ({
            ...prev,
            [id]: addr // 병합된 데이터의 id를 키로 사용
          }));
        }
      });
    };

    fetchCurrentItems();
    getAllRoadData();
  }, [filterData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterData]);

  const getCoord = async (data) => {
    const result = await getRoadPath(data);
    setCenterCoord({ lat: result.latitude, lng: result.longitude });
  };

  return (
    <>
      <CardList>
        {currentItems.length === 0 ? <NoListDiv>검색 결과가 없습니다.</NoListDiv> : null}
        {currentItems.map((data, index) => {
          return (
            <Card
              key={index}
              onClick={() => {
                getCoord(data);
              }}
            >
              {data.name ? (
                <>
                  {data.Classification === "화장실" ? (
                    <CardImage src="./assets/toilet.png" />
                  ) : data.Classification === "급수대" ? (
                    <CardImage src="./assets/waterSupply.png" />
                  ) : data.Classification === "공기주입기" ? (
                    <CardImage src="./assets/anAirInjector.png" />
                  ) : data.Classification === "인증센터" ? (
                    <CardImage src="./assets/CertificationCenter.png" />
                  ) : null}
                  <CardText>
                    <CardTitle>{data.Classification}</CardTitle>
                    <CardRoad>{data.name}</CardRoad>
                    <CardRoad>
                      {isLoading
                        ? "주소 불러오는 중..."
                        : address[data.id]
                        ? address[data.id]
                        : "주소 정보를 찾을 수 없습니다."}
                    </CardRoad>
                  </CardText>
                </>
              ) : (
                <>
                  <CardImage src="/bike.png" />
                  <CardText>
                    <CardTitle>{data.BICYCLE_PATH}</CardTitle>
                    <CardRoad>{data.Classification}</CardRoad>
                  </CardText>
                </>
              )}
            </Card>
          );
        })}
      </CardList>
      <Pagination
        totalItems={filterData.length} // 전체 아이템 수
        currentPage={currentPage} // 현재 페이지
        setCurrentPage={setCurrentPage} // 페이지 변경 함수
        PAGE_ITEMS={PAGE_ITEMS} // 페이지당 항목 수
        PAGE_GROUP={PAGE_GROUP} // 한 번에 보여줄 페이지 수
      />
    </>
  );
};

const NoListDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110%;
  height: 100%;
  font-size: 30px;
  font-weight: 600;
`;

const CardList = styled.div`
  display: flex;
  width: 90%;
  flex-direction: column;
  gap: 10px;
`;
const CardImage = styled.img`
  display: flex;
  margin-right: 20px;
  width: 30%;
  height: 100%;
`;

const Card = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100px;
  margin: 5px;
  padding: 10px;
  background-color: #000000;
  color: white;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
`;

const CardText = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CardTitle = styled.p`
  width: 100%;
  font-size: 18px;
  font-weight: 600;
`;

const CardRoad = styled.p`
  width: 100%;
  color: #bcbcbc;
`;

export default List;
