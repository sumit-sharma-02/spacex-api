import React, { Fragment, useEffect, useState } from "react";
import Capsule from "../images/capsule/capsule.png";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getCapsules,
  getCapsuleDetails,
} from "../actions/capsules";
import { toast } from "react-toastify";
import Loader from "./Loader";
import NotFound from "./NotFound";

const Capsules = () => {
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, capsules, pages, totalPages, error } = useSelector(
    (state) => state.capsules
  );
  const {
    capsuleDetailsLoading = loading,
    capsule,
    capsuleDetailsError = error,
  } = useSelector((state) => state.capsule);

  const capsulesPerPage = 6;
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      showErrorToast(error);
      dispatch(clearErrors());
    }
    dispatch(getCapsules(currentPage, capsulesPerPage));
  }, [dispatch, error, currentPage, capsulesPerPage]);

  const showCapsuleDetails = (capsuleSerialID) => {
    if (error) {
      showErrorToast(capsuleDetailsError);
      dispatch(clearErrors());
    }
    dispatch(getCapsuleDetails(capsuleSerialID));
    setModal(true);
  };

  const formatDate = (date) => {
    const dateFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, dateFormatOptions);
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const showProperCapsuleStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-400";

      case "retired":
        return "text-gray-400";

      case "unknown":
        return "text-orange-400";

      case "destroyed":
        return "text-red-400";

      default:
        return "";
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section>
          {/* overlay */}
          <div
            onClick={() => setModal(false)}
            className={`opacity-0 hidden fixed w-full h-full bg-[rgba(0,0,0,0.3)] z-[999999999] top-0
            right-0 ${modal && "!flex !opacity-100"}`}
          ></div>
          <div className="!max-w-[133rem] !my-0 !mx-auto !px-10 !py-0">
            <div
              className="grid grid-cols-3 grid-rows-[auto] gap-12 items-center text-center px-0 py-12
              w-[110rem] mx-auto my-0 max-md:w-fit max-md:grid-cols-1 max-xlg:grid-cols-2 max-xlg:w-fit"
            >
              {capsules.map((capsule) => (
                <div
                  key={capsule.capsule_serial}
                  className="border-[1px] border-solid border-[#d5d5d5] rounded-[0.3rem] flex w-[35rem]
                  flex-col max-xs:template-cols-1 max-xs:w-full"
                >
                  <div className="w-full h-auto rounded-[0.3rem]">
                    <img
                      src={Capsule}
                      alt="capsule_img"
                      className="w-full h-[27rem]"
                    />
                    <div className="px-[3rem] py-[2rem] flex flex-col text-[#010103]">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col text-left gap-[0.5rem]">
                          <p className="font-bold text-[2.4rem]">
                            {capsule.capsule_serial}
                          </p>
                        </div>
                        <div className="flex flex-col text-right">
                          <p
                            className={`font-bold text-[2rem] ${showProperCapsuleStatusColor(
                              capsule.status
                            )}`}
                          >
                            {capsule.status.charAt(0).toUpperCase() +
                              capsule.status.slice(1)}
                          </p>
                        </div>
                      </div>
                      <div
                        className="grid grid-cols-2 gap-y-[2rem] gap-x-[7rem] mt-[1.5rem] mx-0 my-auto
                        pb-[2.5rem] border-b-[1px] border-solid border-[#c6c6c6] content-between"
                      >
                        <span className="text-[1.8rem] font-medium text-[#777777] text-left">
                          {capsule.type}
                        </span>
                        <span className="text-[1.8rem] font-medium text-[#777777] text-right">
                          {formatDate(capsule.original_launch)}
                        </span>
                      </div>
                      <div
                        className="bg-[#da2128] px-[3rem] text-white py-[1.25rem] rounded-[0.3rem] 
                        shadow-[0_10px_15px_rgba(255,83,48,0.35)] hover:shadow-[0_10px_15px_rgba(255,83,48,0.55)]
                        transition-all delay-100 text-[1.8rem] cursor-pointer"
                        onClick={() =>
                          showCapsuleDetails(capsule.capsule_serial)
                        }
                      >
                        View Details
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {capsules.length !== 0 ? (
              <div className="w-full pb-12 flex justify-center items-center">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className="text-black py-1 px-6 rounded-tl rounded-bl border border-gray-300 
                hover:bg-[#da2128] hover:text-white transition-all delay-100 ease-in-out 
                text-[2rem] disabled:opacity-50"
                >
                  <i className="fa-solid fa-angle-left"></i>
                </button>
                {pages.map((pageNo) => (
                  <span
                    key={pageNo}
                    style={{
                      backgroundColor: `${
                        pageNo === currentPage ? "#da2128" : ""
                      }`,
                      color: `${pageNo === currentPage ? "white" : ""}`,
                    }}
                    className="pb-[0.3rem] px-6 border border-gray-300 text-[1.8rem] transition-all 
                  delay-200 ease-in-out cursor-pointer hover:bg-[#da2128] hover:text-white pt-2 
                  text-black"
                    onClick={() => setCurrentPage(pageNo)}
                  >
                    {pageNo}
                  </span>
                ))}
                <button
                  disabled={currentPage === pages.length}
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  className="text-black py-1 px-6 rounded-tr rounded-br border border-gray-300 
                hover:bg-[#da2128] hover:text-white transition-all delay-100 ease-in-out 
                text-[2rem] disabled:opacity-50"
                >
                  <i className="fa-solid fa-angle-right"></i>
                </button>
              </div>
            ) : (
              <NotFound />
            )}
          </div>
        </section>
      )}
      {/* ----- Modal ----- */}
      <div
        className={`opacity-100 hidden flex-col fixed top-[50%] left-[50%] z-[999999999999] 
        -translate-x-[50%] -translate-y-[50%] w-[83rem] h-[calc(100vh_-_250px)] border-2 border-solid 
        border-white bg-white pr-[2px] text-[#010103] ${
          modal && "!flex !opacity-100"
        } 
        max-md:w-full`}
      >
        {/* title */}
        <div
          className="flex justify-between px-[1.5rem] py-[1rem] bg-[#da2128] text-white 
        items-center"
        >
          <h2 className="text-[2.4rem] uppercase">Capsule Details</h2>
          <i
            onClick={() => setModal(false)}
            className="text-[2.5rem] text-[rgba(255,255,255,0.919)] 
          cursor-pointer transition-all delay-100 fa-solid fa-xmark hover:text-white"
          ></i>
        </div>
        {/* Capsule info */}
        {capsuleDetailsLoading ? (
          <Loader />
        ) : (
          <div
            className="bg-white p-[3rem] grid grid-cols-2 border-b-[1px] border-solid
            border-[rgba(119,119,119,0.6235294118) max-sm:grid-cols-1 max-sm:text-center"
          >
            <div>
              <div className="flex flex-col gap-4">
                <h5 className="font-bold text-[1.8rem] text-[#da2128]">
                  {capsule.type && capsule.type}
                </h5>
                <span className="flex gap-4 max-sm:grid-cols-1 max-sm:text-center max-sm:justify-center">
                  <div className="w-[calc(100%_-_50px)] flex justify-between items-center">
                    <h6 className="font-bold text-[1.5rem] mb-[0.2rem]">
                      Capsule Status
                    </h6>
                    <p
                      className={`font-light text-[1.4rem] ${showProperCapsuleStatusColor(
                        capsule.status && capsule.status
                      )}`}
                    >
                      {capsule.status &&
                        capsule.status.charAt(0).toUpperCase() +
                          capsule.status.slice(1)}
                    </p>
                  </div>
                </span>
              </div>

              <div className="flex flex-col gap-8">
                <span className="text-[1.8rem]">
                  <div className="w-[calc(100%_-_50px)] flex justify-between items-center">
                    <h6 className="font-bold text-[1.5rem] mb-[0.2rem]">
                      Capsule Launch Date
                    </h6>
                    <p className="font-light text-[1.4rem]">
                      {capsule.original_launch &&
                        formatDate(capsule.original_launch)}
                    </p>
                  </div>
                </span>
              </div>

              <div className="flex flex-col gap-8">
                <span className="text-[1.8rem]">
                  <div className="w-[calc(100%_-_50px)] flex justify-between items-center">
                    <h6 className="font-bold text-[1.5rem] mb-[0.2rem]">
                      Capsule Landings
                    </h6>
                    <p className="font-light text-left text-[1.4rem]">
                      {capsule.landings}
                    </p>
                  </div>
                </span>
              </div>

              <div className="flex flex-col gap-8">
                <span className="text-[1.8rem]">
                  <div className="w-[calc(100%_-_50px)] flex justify-between items-center">
                    <h6 className="font-bold text-[1.5rem] mb-[0.2rem]">
                      Capsule Reuse
                    </h6>
                    <p className="font-light text-[1.4rem]">
                      {capsule.reuse_count}
                    </p>
                  </div>
                </span>
              </div>

              <div className="flex flex-col mt-8 gap-4">
                <h5 className="font-bold text-[1.70rem] text-[#da2128]">
                  Capsule Missions
                </h5>
                <span className="flex flex-col max-sm:grid-cols-1 max-sm:text-center max-sm:justify-center">
                  {capsule.missions &&
                    capsule.missions.map((mission, index) => (
                      <Fragment key={"mission-" + index}>
                        <div className="w-[calc(100%_-_50px)] flex justify-between items-center">
                          <h6 className="font-bold text-[1.5rem] mb-[0.2rem]">
                            Mission Name
                          </h6>
                          <p className={"font-light text-[1.4rem]"}>
                            {mission.name}
                          </p>
                        </div>
                        <div className="w-[calc(100%_-_50px)] flex justify-between items-center">
                          <h6 className="font-bold text-[1.5rem] mb-[0.2rem]">
                            Flight
                          </h6>
                          <p className={"font-light text-[1.4rem]"}>
                            {mission.flight}
                          </p>
                        </div>
                      </Fragment>
                    ))}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:mt-[3.5rem]">
              <h5 className="font-bold text-[1.8rem]">
                <span className="text-black">{capsule.capsule_serial}</span>
              </h5>
              <h5 className="font-normal text-[1.4rem]">
                <span className="text-black">{capsule.details}</span>
              </h5>
              {Capsule && (
                <img className="w-full h-auto" src={Capsule} alt="car_img" />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Capsules;
