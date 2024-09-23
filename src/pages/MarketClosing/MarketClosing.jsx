import { Button } from "@nextui-org/react";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaDownload, FaRedo } from "react-icons/fa";
import io from "socket.io-client";
import axiosInstance from "../../axios/axiosInstance";

const BannerCreator = () => {
  const [storedBackground, setStoredBackground] = useState(null);
  const [previewBackground, setPreviewBackground] = useState(null);
  const [logo, setLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [createdBanners, setCreatedBanners] = useState([]);
  const bannerRef = useRef(null);
  const [marketData, setMarketData] = useState({});
  const [spreadMarginData, setSpreadMarginData] = useState({});
  const [symbols, setSymbols] = useState([]);
  const [serverURL, setServerURL] = useState("");
  const [adminId, setAdminId] = useState("");
  const [loading, setLoading] = useState(true);
  const [textColor, setTextColor] = useState("#000000");
  const [companyNameColor, setCompanyNameColor] = useState("#000000");
  const [bidRate, setBidRate] = useState("Loading...");
  const [askRate, setAskRate] = useState("Loading...");
  const [ratesLocked, setRatesLocked] = useState(false);

  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const userName = localStorage.getItem("userName");
        const response = await axiosInstance.get(`/data/${userName}`);
        setAdminId(response.data.data._id);
        setLogo(response.data.data.logo);
        setCompanyName(response.data.data.companyName);
        const uniqueSymbols = [
          ...new Set(
            response.data.data.commodities.map((commodity) => commodity.symbol)
          ),
        ];
        const uppercaseSymbols = uniqueSymbols.map((symbol) =>
          symbol.toUpperCase()
        );
        setSymbols(uppercaseSymbols);

        // Fetch the background
        const backgroundResponse = await axiosInstance.get(
          `/backgrounds/${response.data.data._id}`
        );
        if (backgroundResponse.data.data) {
          setStoredBackground(backgroundResponse.data.data.url);
          setPreviewBackground(backgroundResponse.data.data.url);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data. Please try again.");
      }
    };

    fetchAdminId();
  }, []);

  useEffect(() => {
    const fetchServerURL = async () => {
      try {
        const response = await axiosInstance.get("/server-url");
        setServerURL(response.data.selectedServerURL);
      } catch (error) {
        console.error("Error fetching server URL:", error);
      }
    };

    fetchServerURL();
  }, []);

  useEffect(() => {
    const fetchSpreadMarginData = async () => {
      try {
        const response = await axiosInstance.get(`/spotrates/${adminId}`);
        if (response.data) {
          setSpreadMarginData(response.data);
        }
      } catch (error) {
        console.error("Error fetching spread margin data:", error);
      }
    };

    if (adminId) {
      fetchSpreadMarginData();
    }
  }, [adminId]);

  useEffect(() => {
    if (!serverURL || symbols.length === 0) return;
    const socketSecret = process.env.REACT_APP_SOCKET_SECRET;

    if (!socketSecret) {
      console.error("Socket secret is not defined in environment variables");
      return;
    }
    const socket = io(serverURL, {
      query: { secret: socketSecret },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("request-data", symbols);
    });

    socket.on("market-data", (data) => {
      if (data && data.symbol) {
        setMarketData((prevData) => ({
          ...prevData,
          [data.symbol]: {
            ...data,
            bidChanged:
              prevData[data.symbol] && data.bid !== prevData[data.symbol].bid
                ? data.bid > prevData[data.symbol].bid
                  ? "up"
                  : "down"
                : null,
          },
        }));
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [serverURL, symbols]);

  useEffect(() => {
    if (
      Object.keys(marketData).length > 0 &&
      Object.keys(spreadMarginData).length > 0
    ) {
      setLoading(false);
    }
  }, [marketData, spreadMarginData]);

  const getSpreadOrMarginFromDB = useCallback(
    (metal, type) => {
      const lowerMetal = metal.toLowerCase();
      const key = `${lowerMetal}${
        type.charAt(0).toUpperCase() + type.slice(1)
      }${type === "low" || type === "high" ? "Margin" : "Spread"}`;
      return spreadMarginData[key] || 0;
    },
    [spreadMarginData]
  );

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(format(new Date(), "MMMM d, yyyy"));
    };
    updateDate();
    const intervalId = setInterval(updateDate, 1000 * 60);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!ratesLocked && marketData["Gold"]?.bid) {
      const calculatedBidRate = (
        parseFloat(marketData["Gold"].bid) +
        parseFloat(getSpreadOrMarginFromDB("Gold", "bid"))
      ).toFixed(2);
      setBidRate(calculatedBidRate);

      const calculatedAskRate = (
        parseFloat(calculatedBidRate) +
        parseFloat(getSpreadOrMarginFromDB("Gold", "ask")) +
        parseFloat(0.5)
      ).toFixed(2);
      setAskRate(calculatedAskRate);
    }
  }, [marketData, getSpreadOrMarginFromDB, ratesLocked]);

  const handleExport = () => {
    if (bannerRef.current) {
      // Ensure we're using a background for the export
      const backgroundToUse = previewBackground || storedBackground;
      if (!backgroundToUse) {
        toast.error("No background available. Please select a background.");
        return;
      }

      // Set the background image explicitly
      bannerRef.current.style.backgroundImage = `url(${backgroundToUse})`;

      // Wait for the background image to load
      const img = new Image();
      img.onload = () => {
        html2canvas(bannerRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null, // Ensure transparent background
        }).then((canvas) => {
          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = image;
          link.download = "custom_banner.png";
          link.click();

          setCreatedBanners((prev) => [
            ...prev,
            { img: image, title: companyName || "Untitled" },
          ]);
          toast.success("Banner created and downloaded successfully!");
        });
      };
      img.src = backgroundToUse;
    }
  };

  const resetFields = () => {
    setAddress("");
    setMobileNumber("");
    setTextColor("#000000");
    setCompanyNameColor("#000000");
    setRatesLocked(false);
    setPreviewBackground(storedBackground);

    // Reset the file input
    const fileInput = document.getElementById("background");
    if (fileInput) {
      fileInput.value = "";
    }

    toast.success("Fields reset successfully!");
  };

  const silentResetFields = () => {
    setAddress("");
    setMobileNumber("");
    setTextColor("#000000");
    setCompanyNameColor("#000000");
    setRatesLocked(false);
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewBackground(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBidRateChange = (e) => {
    setBidRate(e.target.value);
    setRatesLocked(true);
  };

  const handleAskRateChange = (e) => {
    setAskRate(e.target.value);
    setRatesLocked(true);
  };

  const toggleRatesLock = () => {
    setRatesLocked(!ratesLocked);
    if (!ratesLocked) {
      toast.success("Rates locked. You can now edit them manually.");
    } else {
      toast.success("Rates unlocked. They will update automatically.");
    }
  };

  const formatAddress = (address) => {
    return address.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < address.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex flex-col space-y-8 p-6">
      <div className="flex space-x-8">
        <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Create</h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="background" className="text-gray-700">
                Change Background:
              </label>
              <input
                id="background"
                type="file"
                accept="image/*"
                onChange={handleBackgroundChange}
                className="w-full p-2 bg-gray-100 rounded"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="textColor" className="text-gray-700">
                Text Color:
              </label>
              <input
                id="textColor"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10 cursor-pointer"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="companyNameColor" className="text-gray-700">
                Company Name Color:
              </label>
              <input
                id="companyNameColor"
                type="color"
                value={companyNameColor}
                onChange={(e) => setCompanyNameColor(e.target.value)}
                className="w-10 h-10 cursor-pointer"
              />
            </div>

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="w-full p-2 bg-gray-100 rounded"
              rows="3"
            />

            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Mobile Number"
              className="w-full p-2 bg-gray-100 rounded"
            />

            <div className="flex items-center space-x-2">
              <label htmlFor="lockRates" className="text-gray-700">
                Lock Rates:
              </label>
              <input
                id="lockRates"
                type="checkbox"
                checked={ratesLocked}
                onChange={toggleRatesLock}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </div>

            <div className="flex space-x-4">
              <input
                type="number"
                value={bidRate}
                onChange={handleBidRateChange}
                placeholder="Bid Rate"
                className="w-1/2 p-2 bg-gray-100 rounded"
                disabled={!ratesLocked}
              />
              <input
                type="number"
                value={askRate}
                onChange={handleAskRateChange}
                placeholder="Ask Rate"
                className="w-1/2 p-2 bg-gray-100 rounded"
                disabled={!ratesLocked}
              />
            </div>

            <div className="flex justify-between">
              <Button color="secondary" auto onClick={resetFields}>
                <FaRedo className="mr-2" /> Reset
              </Button>
              <Button color="success" auto onClick={handleExport}>
                <FaDownload className="mr-2" /> Download
              </Button>
            </div>
          </div>
        </div>

        <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Preview</h3>
          {previewBackground ? (
            <div
              ref={bannerRef}
              className="w-full h-[550px] rounded-lg relative bg-cover bg-center overflow-hidden flex flex-col justify-between p-8"
              style={{
                backgroundImage: `url(${
                  previewBackground || storedBackground
                })`,
              }}
            >
              <div className="text-center" style={{ color: textColor }}>
                <div className="text-4xl font-bold mb-4">
                  {format(new Date(), "dd MMM yyyy").toUpperCase()}
                </div>
                <div className="text-2xl mb-4">CLOSING RATE</div>
                <div className="flex justify-center space-x-16 mb-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">BID</div>
                    <div className="bg-gray-800 bg-opacity-50 p-2 rounded-lg">
                      <span className="text-4xl font-bold">{bidRate}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">ASK</div>
                    <div className="bg-gray-800 bg-opacity-50 p-2 rounded-lg">
                      <span className="text-4xl font-bold">{askRate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center" style={{ color: textColor }}>
                <div className="flex flex-col items-center">
                  {logo && (
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-20 h-20 object-contain mb-2"
                    />
                  )}
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: companyNameColor }}
                  >
                    {companyName}
                  </div>
                  <div className="text-lg mb-1">{formatAddress(address)}</div>
                  <div className="text-lg">{mobileNumber}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-[550px] rounded-lg bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No background selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerCreator;
