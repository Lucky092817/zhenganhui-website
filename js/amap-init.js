// 高德地图初始化

// 固定坐标作为 POI 搜索失败时的兜底位置
const fallbackShopLocation = {
    lng: 120.590176,
    lat: 31.213742,
    address: '江苏省苏州市',
    name: '臻杆汇 台球器材维修'
};

const shopSearchConfig = {
    keyword: '臻杆汇',
    city: '苏州'
};

let activeShopLocation = { ...fallbackShopLocation };

function createMarkerIcon() {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
            <path d="M20 0C9 0 0 9 0 20c0 15 20 30 20 30s20-15 20-30C40 9 31 0 20 0z" fill="#d4af37"/>
            <circle cx="20" cy="20" r="8" fill="#fff"/>
        </svg>
    `;

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

function normalizePoiLocation(poi) {
    if (!poi || !poi.location) return null;

    const lng = Number(poi.location.lng);
    const lat = Number(poi.location.lat);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;

    return {
        lng,
        lat,
        name: poi.name || fallbackShopLocation.name,
        address: poi.address || fallbackShopLocation.address
    };
}

function resolveShopLocation(callback) {
    AMap.plugin(['AMap.PlaceSearch'], () => {
        const placeSearch = new AMap.PlaceSearch({
            city: shopSearchConfig.city,
            citylimit: false,
            pageSize: 5,
            pageIndex: 1
        });

        placeSearch.search(shopSearchConfig.keyword, (status, result) => {
            const pois = result && result.poiList && result.poiList.pois;
            const matchedPoi = Array.isArray(pois)
                ? pois.find(poi => poi.name && poi.name.includes(shopSearchConfig.keyword)) || pois[0]
                : null;
            const poiLocation = normalizePoiLocation(matchedPoi);

            activeShopLocation = poiLocation || { ...fallbackShopLocation };
            callback(activeShopLocation);
        });
    });
}

function createInfoWindowContent(location) {
    return `
        <div style="padding: 15px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 10px 0; color: #d4af37; font-size: 16px;">
                🎱 ${location.name}
            </h3>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">
                📍 ${location.address}
            </p>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">
                ⏰ 周一至周日 9:00-21:00
            </p>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">
                📱 138-0000-0000
            </p>
            <button onclick="openNavigation()" style="
                margin-top: 10px;
                padding: 8px 20px;
                background: #d4af37;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            ">导航到这里</button>
        </div>
    `;
}

function renderMap(location) {
    const position = [location.lng, location.lat];
    const map = new AMap.Map('amap-container', {
        zoom: 16,
        center: position,
        mapStyle: 'amap://styles/whitesmoke',
        scrollWheel: true,
        touchZoom: true,
        doubleClickZoom: true
    });

    const marker = new AMap.Marker({
        position,
        title: location.name,
        icon: new AMap.Icon({
            size: new AMap.Size(20, 25),
            image: createMarkerIcon(),
            imageSize: new AMap.Size(20, 25)
        }),
        offset: new AMap.Pixel(-10, -25)
    });

    marker.setMap(map);

    const infoWindow = new AMap.InfoWindow({
        content: createInfoWindowContent(location),
        offset: new AMap.Pixel(0, -25)
    });

    marker.on('click', () => {
        infoWindow.open(map, marker.getPosition());
    });

    setTimeout(() => {
        infoWindow.open(map, marker.getPosition());
    }, 1000);

    AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {
        map.addControl(new AMap.Scale());
        map.addControl(new AMap.ToolBar());
    });
}

function initAMap() {
    resolveShopLocation(renderMap);
}

// 导航功能
function openNavigation() {
    const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const location = activeShopLocation;

    if (isWeChat) {
        window.location.href = `https://uri.amap.com/marker?position=${location.lng},${location.lat}&name=${encodeURIComponent(location.name)}&src=mypage&coordinate=gaode&callnative=1`;
    } else if (isMobile) {
        window.location.href = `https://uri.amap.com/navigation?to=${location.lng},${location.lat},${encodeURIComponent(location.name)}&mode=car&src=mypage&coordinate=gaode&callnative=1`;
    } else {
        window.open(`https://www.amap.com/search?query=${encodeURIComponent(location.name || location.address)}`, '_blank');
    }
}

window.addEventListener('load', () => {
    if (typeof AMap !== 'undefined') {
        initAMap();
    } else {
        console.error('高德地图API未加载');
    }
});
