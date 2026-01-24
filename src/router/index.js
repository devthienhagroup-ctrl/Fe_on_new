import {createRouter, createWebHistory} from "vue-router";
import LoginForm from "../components/LoginForm.vue";
import {useAuthStore} from "../stores/authStore.js";
import Menu from "../components/Menu.vue";
import EmployeeManager from "../components/EmployeeManager.vue";
import DepartmentManager from "../components/DepartmentManager.vue";
import Project from "../components/Project.vue";
import CreateProject from "../components/CreateProject.vue";
import WorkItemManager from "../components/work-items/WorkItemManager.vue";
import TeamManager from "../components/TeamManager.vue";
import PricingPlans from "../components/Pricing&Plans.vue";
import TypeManager from "../components/TypeManager.vue";
import UpdateProject from "../components/UpdateProject.vue";
import ServiceManager from "../components/ServiceManager.vue";
import CustomerManager from "../components/CustomerManager.vue";
import AuditLogManager from "../components/AuditLogManager.vue";
import HomeAdmin from "../components/HomeAdmin.vue";
import RolePermissionManager from "../components/RolePermissionManager.vue";
import AdminValuationManager from "../components/land/AdminValuationManager.vue";
import ServiceSystemManager from "../components/ServiceSystemManager.vue";

import NewsEditor from "../components/cms/components/home/NewsEditor.vue";
import LandingPage from "../components/user/Home/LandingPage.vue";
import MenuUser from "../components/user/Home/components/MenuUser.vue";
import QuickSaleSolution from "../components/user/QuickSaleSolution/QuickSaleSolution.vue";
import TestComponent from "../components/user/TestComponent.vue";
import EstimateProperty from "../components/user/EstimateProperty/EstimateProperty.vue";
import LoginUser from "../components/user/Login/LoginUser.vue";
import Recruitment from "../components/user/Recruitment/Recruitment.vue";
import Contact from "../components/user/Contact/Contact.vue";
import News from "../components/user/News/News.vue";
import MyTeamMain from "../components/team/MyTeamMain.vue";
import FeatureInDevelopment from "../components/user/FeatureInDevelopment.vue";
import CollaboratorRecruitment from "../components/user/CollaboratorRecruitment/CollaboratorRecruitment.vue";
import CollaboratorJobDetail from "../components/user/CollaboratorRecruitment/Component/CollaboratorJobDetail.vue";
import PersonalTaskManager from "../components/user/CollaboratorRecruitment/Component/PersonalTaskManager.vue";
import ServicePackageSystem from "../components/user/Profile/component/ServicePackageSystem.vue";
import MyValuationManager from "../components/land/my-valuation/MyValuationManager.vue";
import Profile from "../components/user/Profile/Profile.vue";
import AccountCenter from "../components/user/Profile/component/AccountCenter.vue";
import AccountInfo from "../components/user/Profile/component/AccountInfo.vue";
import Security from "../components/user/Profile/component/Security.vue";
import TransactionHistory from "../components/user/Profile/component/TransactionHistory.vue";
import PackageBenefits from "../components/user/Profile/component/PackageBenefits.vue";
import Support from "../components/user/Profile/component/Support.vue";
import PaymentPage from "../components/land/my-valuation/components/PaymentPage.vue";
import AppointmentManager from "../components/AppointmentManager.vue";
import Investments from "../components/user/Investment/Investments.vue";
import InvestmentDetail from "../components/user/Investment/InvestmentDetail.vue";
import Payment from "../components/user/Profile/component/Payment.vue";
import ProductList from "../components/productAdmin/ProductList.vue";
import ProductDetail from "../components/productAdmin/ProductDetail.vue";
import ProductUser from "../components/productAdmin/productUser/ProductUser.vue";
import ProductUpdate from "../components/productAdmin/ProductUpdate.vue";
import ProductDetail2 from "../components/productAdmin/productUser/ProductDetail2.vue";
import ProductCreate from "../components/productAdmin/ProductCreate.vue";
import HostManager from "../components/host/HostManager.vue";

import Ga4EventExample from "../components/Ga4EventExample.vue";
import PaymentPage2 from "../components/productAdmin/PaymentPage2.vue";

import cms from "/src/components/cms/cms.vue";
import Banner from "../components/cms/components/home/Banner.vue";
import Stats from "../components/cms/components/home/Stats.vue";
import Hero from "../components/cms/components/home/Hero.vue";
import Service from "../components/cms/components/home/Service.vue";
import OverView from "../components/cms/components/home/OverView.vue";
import ImpressiveNumber from "../components/cms/components/home/ImpressiveNumber.vue";
import SoldProjects from "../components/cms/components/home/SoldProjects.vue";
import Reviews from "../components/cms/components/home/Reviews.vue";
import SystemEvaluation from "../components/cms/components/home/SystemEvaluation.vue";
import MediaAboutUs from "../components/cms/components/home/MediaAboutUs.vue";
import ReviewsBackgroundImage from "../components/cms/components/home/ReviewsBackgroundImage.vue";
import ContactEditor from "../components/cms/components/home/ContactEditor.vue";
import QSHeader from "../components/cms/components/quickSale/QSHeader.vue";
import QS1DinhGiaSoBo from "../components/cms/components/quickSale/QS1DinhGiaSoBo.vue";
import QS2DongYGiaSoBo from "../components/cms/components/quickSale/QS2DongYGiaSoBo.vue";
import QS3KhaoSat from "../components/cms/components/quickSale/QS3KhaoSat.vue";
import QS4DanhGia from "../components/cms/components/quickSale/QS4DanhGia.vue";
import QS5ThoaThuan from "../components/cms/components/quickSale/QS5ThoaThuan.vue";
import QS6YTuong from "../components/cms/components/quickSale/QS6YTuong.vue";
import QS7TrienKhai from "../components/cms/components/quickSale/QS7TrienKhai.vue";
import QS8TuVanHoTro from "../components/cms/components/quickSale/QS8TuVanHoTro.vue";
import QS9HoTroDamPhan from "../components/cms/components/quickSale/QS9HoTroDamPhan.vue";
import QS10HoTroPhapLy from "../components/cms/components/quickSale/QS10HoTroPhapLy.vue";
import Benefits from "../components/cms/components/quickSale/Benefits.vue";
import QSPopup from "../components/cms/components/quickSale/QSPopup.vue";
import QSImageBackground3 from "../components/cms/components/quickSale/QSImageBackground3.vue";
import Header from "../components/cms/components/estimateProperty/Header.vue";
import Proccess from "../components/cms/components/estimateProperty/Proccess.vue";
import ProccessStep from "../components/cms/components/estimateProperty/ProccessStep.vue";
import Factor from "../components/cms/components/estimateProperty/Factor.vue";
import Reason from "../components/cms/components/estimateProperty/Reason.vue";
import Fee from "../components/cms/components/estimateProperty/Fee.vue";
import QuickFee from "../components/cms/components/estimateProperty/QuickFee.vue";
import Faq from "../components/cms/components/estimateProperty/Faq.vue";
import ApplyBtn from "../components/cms/components/recruitment/ApplyBtn.vue";
import Form from "../components/cms/components/recruitment/Form.vue";
import JobPosition from "../components/cms/components/recruitment/JobPosition.vue";
import Post from "../components/cms/components/recruitment/Post.vue";
import HeaderRC from "../components/cms/components/recruitment/Header.vue";
import BenefitsRC from "../components/cms/components/recruitment/Benefits.vue"
import HeroRC from "../components/cms/components/recruitment/Hero.vue"
import Department from "../components/cms/components/recruitment/Department.vue";
import FeaturedNewsE from "../components/cms/components/news/FeaturedNewsE.vue";
import LatestNewsE from "../components/cms/components/news/LatestNewsE.vue";
import CategoryNewsE from "../components/cms/components/news/CategoryNewsE.vue";
import EmailSubscribeE from "../components/cms/components/news/EmailSubscribeE.vue";
import ContactE from "../components/cms/components/contact/Contact.vue"
import DetailHero from "../components/cms/components/investment/DetailHero.vue";
import DetailPackage from "../components/cms/components/investment/DetailPackage.vue";
import DetailInvestor from "../components/cms/components/investment/DetailInvestor.vue";
import HeroInvm from "../components/cms/components/investment/Hero.vue";
import InvmList from "../components/cms/components/investment/InvestmentList.vue";
import InvmModal from "../components/cms/components/investment/InvestmentModal.vue";
import NewsManagement from "../components/cms/news/NewsManagement.vue";
import NewsDetail from "../components/user/News/NewsDetail.vue";
import InvestmentBranchManagement from "../components/Investment/InvestmentBranchManagement.vue";
import PageNotFound from "../components/PageNotFound.vue";
import SoldProject from "../components/user/SoldProject/SoldProject.vue";
import InvestmentPayment from "../components/user/Investment/InvestmentPayment.vue";
import Invested from "../components/user/Investment/Invested/Invested.vue";
import InvestorManagement from "../components/user/Investment/Invested/InvestorManagement.vue";
import moigioi from "../components/user/MoiGioi/moigioi.vue";
import Test from "../components/productAdmin/test.vue";
import Test1 from "../components/productAdmin/test1.vue";
import Test3 from "../components/myProduct/test3.vue";
import productDetailUser from "../components/myProduct/productDetailUser.vue"
import PaymentQR from "../components/user/Profile/component/PaymentQR.vue";
import productCreateUser from "../components/productUser/productCreateUser.vue"
import productUpdate from "../components/productUser/ProductUpdate.vue"
import RutTienAdmin from "../components/rutTienAdmin.vue";


import Layout from "../components/user/NewUser/NewHome/Layout.vue";
import MainContentHome from "../components/user/NewUser/NewHome/MainContentHome.vue";
import GlobalCSS from "../components/cms/NewCms/homeNew/GlobalCSS.vue";
import MainContent from "../components/cms/NewCms/homeNew/MainContent.vue";
import QuickSale30D from "../components/user/NewUser/QuickSale30D/QuickSale30D.vue";
import QuickSale from "../components/cms/NewCms/QuickSaleNew/QuickSale.vue";
import ESNew from "../components/user/NewUser/EstimateProperty/ESNew.vue";
import EstimatePropertyNew from "../components/cms/NewCms/EstimatePropertyNew/EstimatePropertyNew.vue";


import DemoGiaoDien from "../components/thiet-kegiandien/marketing-cap-da-ta.vue";
import test from "../components/thiet-kegiandien/marketing-cap-da-ta.vue"
import test1 from "../components/thiet-kegiandien/telesales-lien-he-khach-hang.vue"
import test2 from "../components/thiet-kegiandien/admin-saleadmin.vue"
import TeamManagement from "../components/user/NewUser/TeamManagement/TeamManagement.vue";
import TeamManagementCMS from "../components/cms/NewCms/TeamManagement/TeamManagementCMS.vue";
import AppointmentPage from "../components/thiet-kegiandien/AppointmentsPage.vue";
import AppointmentsPage from "../components/thiet-kegiandien/AppointmentsPage.vue";
import PropertyManagement from "../components/user/NewUser/PropertyManagement/PropertyManagement.vue";
import Projectmanagement from "../components/user/NewUser/ProjectManagement/Projectmanagement.vue";
import CTVRecruit from "../components/user/NewUser/CTVRecruit/CTVRecruit.vue";
import ProjectManagementCMS from "../components/cms/NewCms/ProjectMannagement/ProjectManagementCMS.vue";
import PropertyManagementCMS from "../components/cms/NewCms/PropertyManagement/PropertyManagementCMS.vue";
import CTVRecruitCMS from "../components/cms/NewCms/CTVRecruit/CTVRecruitCMS.vue";
import DichVuSetting from "../components/dich-vu/Dich-vu-setting.vue";
import ProductReportManagemnet from "../components/productAdmin/productReportManagement/ProductReportManagemnet.vue";
import ContactManagement from "../components/ContactManagement/ContactManagement.vue";
import ServicePackages from "../components/user/NewUser/ServicePackages/ServicePackages.vue";
import ServicePackageCMS from "../components/cms/NewCms/ServicePackages/ServicePackageCMS.vue";

const routes = [

    {
        path: "/-thg/dich-vu",
        name: "DichVuSetting",
        component: DichVuSetting,
        meta: {requiresAuth: false, enableTailwind: true}
    },
    {
        path: "/-thg/nhap-lieu",
        name: "TeamCollaboration1",
        component: Menu,
        meta: {requiresAuth: false, enableTailwind: false},
        children: [{
            path: '',
            name: "NHAP_LIEU",
            component: test,
        }]
    },
    {
        path: "/-thg/quan-tri-du-lieu",
        name: "TeamCollaboration",
        component: Menu,
        meta: {requiresAuth: false, enableTailwind: false},
        children: [{
            path: '',
            name: "QUAN_TRI_KHACH_HANG",
            component: test2,
        }]
    },
    {
        path: "/-thg/telesale-lien-he-khach-hang",
        name: "TELESALESetyui",
        component: Menu,
        meta: {requiresAuth: false, enableTailwind: false},
        children: [{
            path: '',
            name: "LIEN_HE",
            component: test1,
        }]
    },

    {
        path: "/-thg/dang-nhap",
        name: "LoginForm",
        component: LoginForm,
    },
    {
        path: '/giao-dien',
        component: AppointmentPage,
        meta: {requiresAuth: false, loginFrom: "admin", enableTailwind: true},
    },
    {
        path: "/user/quan-ly-san-pham",
        component: MenuUser,
        children: [
            {
                path: ":id",
                name: "QLSAN-DETAIL",
                component: productDetailUser,
            },
            {
                path: "cap-nhat/:id",
                name: "QLSAN-DETAIL-UPDATE",
                component: productUpdate,
            },
            {
                path: "tao-moi",
                name: "QLSAN-CREATE",
                component: productCreateUser,
            }
        ]
    },
    {
        path: "/moi-gioi",
        name: "MoiGioiShow",
        component: MenuUser,
        meta: {requiresAuth: false},
        children: [
            {
                path: '',
                name: 'MoiGioiShow1',
                component: moigioi
            }
        ]
    },
    {
        path: "/tin-tuc",
        name: "News",
        component: MenuUser,
        meta: {requiresAuth: false},
        children: [
            {
                path: '',
                name: 'news',
                component: News
            },
            {
                path: ':id',
                name: 'news-detail',
                component: NewsDetail
            }
        ]
    },
    {
        path: '/-thg/quan-tri-noi-dung',
        name: 'cms',
        component: Menu,
        meta: {requiresAuth: true, loginFrom: "admin"},
        children: [
            {
                path: 'trang-chu',
                name: 'CMS',
                component: cms,
                children: [
                    {
                        path: 'banner',
                        name: 'banner',
                        component: Banner
                    },
                    {
                        path: "thong-ke",
                        name: "stats",
                        component: Stats
                    },
                    {
                        path: 'noi-bat',
                        name: "hero",
                        component: Hero
                    },
                    {
                        path: 'dich-vu',
                        name: 'service',
                        component: Service
                    },
                    {
                        path: 'tong-quan',
                        name: 'overView',
                        component: OverView
                    },
                    {
                        path: 'con-so-an-tuong',
                        name: 'impressiveNumber',
                        component: ImpressiveNumber
                    },
                    {
                        path: 'du-an-da-ban',
                        name: 'soldProjects',
                        component: SoldProjects
                    },
                    {
                        path: 'danh-gia-khach-hang',
                        name: 'reviews',
                        component: Reviews
                    },
                    {
                        path: 'danh-gia-he-thong',
                        name: 'systemEvaluation',
                        component: SystemEvaluation
                    },
                    {
                        path: 'truyen-thong',
                        name: 'mediaAboutUs',
                        component: MediaAboutUs
                    },
                    {
                        path: 'tin-tuc',
                        name: 'newsEditor',
                        component: NewsEditor
                    },
                    {
                        path: 'lien-he',
                        name: 'contactEditor',
                        component: ContactEditor
                    },
                    {
                        path: 'anh-nen-danh-gia',
                        name: 'reviewBackgroundImage',
                        component: ReviewsBackgroundImage
                    }
                ]
            },
            {
                path: 'trang-chu-moi',
                name: 'HomeNew',
                component: cms,
                children: [
                    {
                        path: 'global-css',
                        name: 'GlobalCSS',
                        component: GlobalCSS
                    },
                    {
                        path: 'noi-dung-chinh',
                        name: 'MainContent',
                        component: MainContent
                    }
                ]
            },
            {
                path: 'ban-nhanh',
                name: 'QuickSaleEditor',
                component: cms,
                children: [
                    {
                        path: 'header',
                        name: 'Header',
                        component: QSHeader
                    },
                    {
                        path: 'dinh-gia-so-bo',
                        name: 'qs1',
                        component: QS1DinhGiaSoBo
                    },
                    {
                        path: 'dong-y-gia-so-bo',
                        name: 'qs2',
                        component: QS2DongYGiaSoBo
                    },
                    {
                        path: 'khao-sat',
                        name: 'qs3',
                        component: QS3KhaoSat
                    },
                    {
                        path: 'danh-gia-giao-dich',
                        name: 'qs4',
                        component: QS4DanhGia
                    },
                    {
                        path: "thoa-thuan",
                        name: 'qs5',
                        component: QS5ThoaThuan
                    },
                    {
                        path: "y-tuong",
                        name: 'qs6',
                        component: QS6YTuong
                    },
                    {
                        path: "trien-khai",
                        name: 'qs7',
                        component: QS7TrienKhai
                    },
                    {
                        path: "tu-van-ho-tro",
                        name: 'qs8',
                        component: QS8TuVanHoTro
                    },
                    {
                        path: "ho-tro-dam-phan",
                        name: 'qs9',
                        component: QS9HoTroDamPhan
                    },
                    {
                        path: "ho-tro-phap-ly",
                        name: 'qs10',
                        component: QS10HoTroPhapLy
                    },
                    {
                        path: "loi-ich",
                        name: 'benefits',
                        component: Benefits
                    },
                    {
                        path: 'popup',
                        name: 'popup',
                        component: QSPopup
                    },
                    {
                        path: 'anh-nen-3',
                        name: 'anhNen3',
                        component: QSImageBackground3
                    }

                ]
            },
            {
                path: 'ban-nhanh-moi',
                name: 'QuickSaleNew',
                component: cms,
                children: [
                    {
                        path: 'noi-dung-chinh',
                        name: 'NewQuickSale',
                        component: QuickSale
                    }
                ]
            },
            {
                path: 'dinh-gia-bds',
                name: 'EP',
                component: cms,
                children: [
                    {
                        path: 'header',
                        name: 'EPHeader',
                        component: Header
                    },
                    {
                        path: 'quy-trinh-dinh-gia',
                        name: 'EPProccess',
                        component: Proccess
                    },
                    {
                        path: 'cac-buoc-trong-quy-trinh',
                        name: 'ProccessStep',
                        component: ProccessStep
                    },
                    {
                        path: 'gia-tri-bds-dua-tren',
                        name: 'EPFactor',
                        component: Factor
                    },
                    {
                        path: 'ly-do',
                        name: 'EPReason',
                        component: Reason
                    },
                    {
                        path: 'bang-phi',
                        name: 'EPFee',
                        component: Fee
                    },
                    {
                        path: 'tinh-phi-nhanh',
                        name: 'EPQuickFee',
                        component: QuickFee
                    },
                    {
                        path: 'cau-hoi-thuong-gap',
                        name: 'EPFaq',
                        component: Faq
                    }

                ]
            },
            {
                path: 'dinh-gia-moi',
                name: 'newES',
                component: cms,
                children: [
                    {
                        path: 'noi-dung-chinh',
                        name: 'NewES',
                        component: EstimatePropertyNew
                    }
                ]
            },
            {
                path: 'tuyen-dung',
                name: 'recruitmentEditor',
                component: cms,
                children: [
                    {
                        path: 'nut-ung-tuyen',
                        name: 'applyBtn',
                        component: ApplyBtn
                    },
                    {
                        path: 'loi-ich',
                        name: 'benefitsRC',
                        component: BenefitsRC
                    },
                    {
                        path: 'vi-tri-dang-tuyen',
                        name: 'departmentRC',
                        component: Department
                    },
                    {
                        path: 'form-ung-tuyen',
                        name: 'formRC',
                        component: Form
                    },
                    {
                        path: 'header',
                        name: 'headerRC',
                        component: HeaderRC
                    },
                    {
                        path: 'co-hoi-viec-lam',
                        name: 'jobPositionRC',
                        component: JobPosition
                    },
                    {
                        path: 'bai-viet-tuyen-dung',
                        name: 'postRC',
                        component: Post
                    },
                    {
                        path: 'noi-bat',
                        name: 'heroRC',
                        component: HeroRC
                    }
                ]
            },
            {
                path: 'tin-tuc',
                name: 'NewsEditor',
                component: cms,
                children: [
                    {
                        path: 'tin-noi-bat',
                        name: 'featuredNewsE',
                        component: FeaturedNewsE
                    },
                    {
                        path: 'tin-moi-nhat',
                        name: 'latestNewsE',
                        component: LatestNewsE
                    },
                    {
                        path: 'danh-muc-tin-tuc',
                        name: 'CategoryNewsE',
                        component: CategoryNewsE
                    },
                    {
                        path: 'dang-ky-nhan-tin',
                        name: 'EmailSubcribe',
                        component: EmailSubscribeE
                    }
                ]
            },
            {
                path: 'lien-he',
                name: 'contactEditor',
                component: cms,
                children: [
                    {
                        path: '',
                        name: 'contactE',
                        component: ContactE
                    }
                ]
            },
            {
                path: 'hop-tac',
                name: 'investmentEditor',
                component: cms,
                children: [
                    {
                        path: 'noi-bat',
                        name: 'heroInvestment',
                        component: HeroInvm
                    },
                    {
                        path: 'danh-sach',
                        name: 'invmList',
                        component: InvmList
                    },
                    {
                        path: 'hop-thoai',
                        name: 'invmModal',
                        component: InvmModal
                    },
                    {
                        path: 'chi-tiet-noi-bat',
                        name: 'detailHero',
                        component: DetailHero
                    },
                    {
                        path: 'chi-tiet-goi-dang-ky',
                        name: 'detailPackage',
                        component: DetailPackage
                    },
                    {
                        path: 'chi-tiet-danh-sach-nguoi-hop-tac',
                        name: 'detailInvestor',
                        component: DetailInvestor
                    }
                ]
            },
            {
                path: 'quan-ly-nhom',
                name: 'teammanagement-cms',
                component: cms,
                children: [
                    {
                        path: 'noi-dung-chinh',
                        name: 'TeamManagementCMS',
                        component: TeamManagementCMS
                    }
                ]
            },
            {
                path: 'quan-ly-du-an',
                name: 'projectmanagement-cms',
                component: cms,
                children: [
                    {
                        path: 'noi-dung-chinh',
                        name: 'ProjectmanagementCMS',
                        component: ProjectManagementCMS
                    }
                ]
            },
            {
                path: 'quan-ly-tai-san',
                name: 'propertymanagement-cms',
                component: cms,
                children: [
                    {
                        path: 'noi-dung-chinh',
                        name: 'PropertyManagementCMS',
                        component: PropertyManagementCMS
                    }
                ]
            },
            {
                path: 'ung-tuyen-ctv',
                name: 'CTV-recruit-cms',
                component: cms,
                children: [
                    {
                        path: 'noi-dung-chinh',
                        name: 'CTVRecruitCMS',
                        component: CTVRecruitCMS
                    }
                ]
            },
            {
                path: 'goi-dich-vu',
                name: 'service-packages-cms',
                component: cms,
                children: [
                    {
                        path: 'noi-dung-chinh',
                        name: 'ServicePackagesCMS',
                        component: ServicePackageCMS
                    }
                ]
            },
            {
                path: 'quan-ly-tin-tuc',
                name: 'newsManagement',
                component: cms,
                children: [
                    {
                        path: '',
                        name: 'newsM',
                        component: NewsManagement
                    }
                ]
            }
        ]
    },
    {
        path: "/-thg/quan-ly-nguoi-dung",
        component: Menu,
        meta: {
            requiresAuth: true,
            enableTailwind: true,
            loginFrom: "admin",
        },
        children: [
            {
                path: "",
                name: "HostManager",
                component: HostManager
            }
        ]
    },
    {
        path: "/-thg/yeu-cau-rut-tien",
        name: "1900009",
        component: Menu,
        meta: {
            requiresAuth: true,
            enableTailwind: true,
            loginFrom: "admin",
        },
        children: [
            {
                path: "",
                name: "RutTienAdmin",
                component: RutTienAdmin
            },
        ]
    },
    {
        path: "/-thg/quan-ly-san-pham",
        component: Menu,
        meta: {
            requiresAuth: true,
            enableTailwind: true,
            loginFrom: "admin",
        },
        children: [
            {
                path: "",
                name: "ProductList",
                component: ProductList
            },
            {
                path: "tao-moi",
                name: "ProductCreate",
                component: ProductCreate
            },
            {
                path: "cap-nhat/:id",
                name: "ProductUpdate",
                component: ProductUpdate,
                props: true
            },
            {
                path: ":id",
                name: "ProductDetail",
                component: ProductDetail,
                props: true
            }
        ]
    },
    {
        path: "/loi-de-nghi",
        component: MenuUser,
        meta: {
            requiresAuth: true,
            loginFrom: "user",
        },
        children: [
            {
                path: "",
                name: "LDN",
                component: Test1
            }
        ]
    },
    {
        path: "/-thg/yeu-cau-hop-tac",
        component: Menu,
        meta: {
            requiresAuth: true,
            enableTailwind: true,
            loginFrom: "admin",
        },
        children: [
            {
                path: "",
                name: "YCHT_ADMIN",
                component: Test
            }
        ]
    },
    {
        path: "/san-pham-cua-ban",
        component: MenuUser,
        children: [
            {
                path: "",
                name: "SANPHAM-CUABAN",
                component: Test3,
                meta: {
                    requiresAuth: true,
                    hideFooterMap: false,
                    enableTailwind: true
                }
            }
        ]
    },
    {
        path: "/san-pham-thien-ha",
        component: MenuUser,
        meta: {
            requiresAuth: false,
            hideFooterMap: false,
            enableTailwind: true
        },
        children: [
            {
                path: "",
                name: "ProductUser",
                component: ProductUser
            },
            {
                path: ":slug-:id(\\d+)",
                name: "ProductDetailSEO",
                component: ProductDetail2,
                props: true
            },
        ]
    },
    {
        path: "/du-an-da-ban",
        component: MenuUser,
        meta: {
            requiresAuth: false,
            hideFooterMap: false,
            enableTailwind: true
        },
        children: [
            {
                path: "",
                name: "DuAnDaBan",
                component: SoldProject
            },
        ]
    },
    {
        path: "/-thg/loai-hinh",
        component: Menu,
        meta: {requiresAuth: true, loginFrom: "admin"},
        children: [
            {
                path: '',
                name: 'TypeManager',
                component: TypeManager
            }
        ]
    },
    {
        path: "/-thg/nhom",
        component: Menu,
        meta: {requiresAuth: true, loginFrom: "admin"},
        children: [
            {
                path: '',
                name: 'TeamManager',
                component: TeamManager
            }
        ]
    },
    {
        path: '/-thg/nhan-vien',
        component: Menu,
        meta: {requiresAuth: true, loginFrom: "admin"},
        children: [
            {
                path: '',
                name: 'EmployeeManager',
                component: EmployeeManager
            }
        ]
    },
    {
        path: '/-thg/phong-ban',
        component: Menu,
        meta: {requiresAuth: true, loginFrom: "admin"},
        children: [
            {
                path: '',
                name: 'DepartmentManager',
                component: DepartmentManager
            }
        ]
    },
    {
        path: '/-thg/dich-vu',
        component: Menu,
        meta: {requiresAuth: true, loginFrom: "admin"},
        children: [
            {
                path: '',
                name: 'ServiceManager',
                component: ServiceManager
            }
        ]
    },
    {
        path: '/-thg/phan-quyen',
        component: Menu,
        meta: {requiresAuth: true, loginFrom: "admin"},
        children: [
            {
                path: '',
                name: 'RolePermissionManager',
                component: RolePermissionManager
            }
        ]
    },
    {
        path: '/-thg/khach-hang',
        component: Menu,
        meta: {requiresAuth: true, loginFrom: "admin"},
        children: [
            {
                path: '',
                name: 'CustomerManager',
                component: CustomerManager
            }
        ]
    },
    {
        path: '/-thg/dinh-gia',
        component: Menu,
        meta: {requiresAuth: true, loginFrom: "admin"},
        children: [
            {
                path: '',
                name: 'AdminValuationManager',
                component: AdminValuationManager
            }
        ]
    },
    {
        path: '/bao-cao-dinh-gia',
        component: MenuUser,
        meta: {
            requiresAuth: true,
            loginFrom: "user",
            hideFooterMap: false,

        },
        children: [
            {
                path: '',
                name: 'MyValuationManager',
                component: MyValuationManager
            }
        ]
    },
    {
        path: '/-thg/goi-he-thong',
        component: Menu,
        meta: {requiresAuth: true, loginFrom: "admin"},
        children: [
            {
                path: '',
                name: 'servicesystem',
                component: ServiceSystemManager
            }
        ]
    },
    {
        path: '/-thg/lich-hen',
        component: Menu,
        meta: {requiresAuth: true, loginFrom: "admin"},
        children: [
            {
                path: '',
                name: 'AppointmentManager',
                component: AppointmentManager
            }
        ]
    },
    {
        path: '/-thg/quan-ly-lich-hen',
        component: Menu,
        meta: {requiresAuth: true, loginFrom: "admin"},
        children: [
            {
                path: '',
                name: 'AppointmentsPage1',
                component: AppointmentsPage
            }
        ]
    },
    {
        path: '/nhom-cua-toi',
        component: MenuUser,
        meta: {requiresAuth: true, loginFrom: "user", hideFooterMap: false},
        children: [
            {
                path: '',
                name: 'myTeamUser',
                component: MyTeamMain
            }
        ]
    },
    {
        path: '/-thg/lich-su-he-thong',
        component: Menu,
        meta: {requiresAuth: true, loginFrom: "admin"},
        children: [
            {
                path: '',
                name: 'auditlog',
                component: AuditLogManager
            }
        ]
    },
    {
        path: '/-thg/quan-ly',
        name: 'homeAdmin',
        component: HomeAdmin,
        meta: {requiresAuth: true}
    },
    {
        path: '/-thg/du-an',
        component: Menu,
        meta: {requiresAuth: true, loginFrom: "admin"},
        children: [
            {
                path: '',
                name: 'Project',
                component: Project
            },
            {
                path: 'tao-moi',
                name: 'CreateProject',
                component: CreateProject
            },
            {
                path: 'hang-muc/:projectId?',
                name: 'WorkItemManager',
                component: WorkItemManager
            },
            {
                path: 'cap-nhat/:projectId?',
                name: 'UpdateProject',
                component: UpdateProject
            }
        ]
    },
    {
        path: "/trang-chu",
        name: "Landingpage",
        component: MenuUser,
        meta: {enableTailwind: true, requiresAuth: false},
        children: [
            {
                path: '',
                name: 'landingpage',
                component: LandingPage
            }
        ]
    },
    {
        path: "/giai-phap-ban-nhanh",
        name: "QuickSale",
        component: MenuUser,
        meta: {
            showQSPopup: true,
            enableTailwind: true,
            requiresAuth: false
        },
        children: [
            {
                path: '',
                name: 'quick-sale',
                component: QuickSaleSolution
            }
        ]
    },
    {
        path: "/dinh-gia-bds",
        name: "EstimateProperty",
        meta: {enableTailwind: true, requiresAuth: false},
        component: MenuUser,
        children: [
            {
                path: '',
                name: 'estimate-property',
                component: EstimateProperty
            }
        ]
    },
    {
        path: "/du-an-da-ban",
        name: "SoldProject",
        component: MenuUser,
        meta: {enableTailwind: true, requiresAuth: false},
        children: [
            {
                path: '',
                name: 'sold-project',
                component: SoldProject
            }
        ]
    },
    {
        path: "/dang-nhap",
        name: "LoginUser",
        component: MenuUser,
        meta: {loginFrom: "user", requiresAuth: false},
        children: [
            {
                path: '',
                name: 'login-user',
                component: LoginUser
            }
        ]
    },
    {
        path: "/tuyen-dung",
        name: "Recruitment",
        component: MenuUser,
        meta: {requiresAuth: false},
        children: [
            {
                path: '',
                name: 'recruitment',
                component: Recruitment
            }
        ]
    },
    {
        path: "/goi-dich-vu",
        name: "ServicePackage",
        component: MenuUser,
        meta: {requiresAuth: false},
        children: [
            {
                path: '',
                name: 'service-package-system',
                component: ServicePackageSystem
            }
        ]
    },
    {
        path: "/lien-he",
        name: "Contact",
        component: MenuUser,
        meta: {requiresAuth: false},
        children: [
            {
                path: '',
                name: 'contact',
                component: Contact,
                meta: {hideFooterMap: true}
            }
        ]
    },
    {
        path: "/thanh-toan",
        name: "Checkout",
        component: MenuUser,
        meta: {requiresAuth: false},
        children: [
            {
                path: '',
                name: 'checkout2',
                component: PaymentPage,
                meta: {hideFooterMap: false}
            }
        ]
    },
    {
        path: "/thanh-toan-san-pham",
        name: "Checkout1",
        component: MenuUser,
        meta: {requiresAuth: true},
        children: [
            {
                path: '',
                name: 'checkout11111',
                component: PaymentPage2,
                meta: {hideFooterMap: false}
            }
        ]
    },
    {
        path: "/nap-tien-ca-nhan",
        name: "Checkout114",
        component: MenuUser,
        meta: {requiresAuth: false},
        children: [
            {
                path: '',
                name: 'checkout11111111',
                component: PaymentQR,
                meta: {hideFooterMap: false}
            }
        ]
    },
    {
        path: "/tinh-nang-dang-phat-trien",
        name: "fid",
        component: FeatureInDevelopment,
        meta: {requiresAuth: false}
    },
    {
        path: "/cong-viec-cong-tac-vien",
        name: "CollaboratorJobs",
        component: MenuUser,
        meta: {requiresAuth: false},
        children: [
            {
                path: '',
                name: 'list-collaborator-jobs',
                component: CollaboratorRecruitment
            },
            {
                path: ':id',
                name: 'collaborator-job-detail',
                component: CollaboratorJobDetail,
                props: true
            },
            {
                path: 'nhiem-vu-ca-nhan/:id',
                name: 'personal-task',
                component: PersonalTaskManager,
                props: true
            }
        ]
    },
    {
        path: "/test",
        name: 'testtt',
        component: TestComponent,
        meta: {
            enableTailwind: true,
            newCustomScroll: true,
            useAOS: true
        }
    },
    {
        path: "/khong-tim-thay",
        name: 'pageNotFound',
        component: PageNotFound
    },
    {
        path: "/-thg/quan-ly-hop-tac",
        name: "InvestmentBranchManagement",
        component: Menu,
        children: [
            {
                path: "",
                name: "investment-branch",
                component: InvestmentBranchManagement
            }
        ]
    },
    {
        path: "/ho-so",
        name: "Profile",
        meta: {requiresAuth: true, loginFrom: "user", hideFooterMap: false},
        component: MenuUser,
        children: [
            {
                path: '',
                name: 'profile',
                component: Profile,
                children: [
                    {
                        path: 'trung-tam-tai-khoan',
                        name: 'AccountCenter',
                        component: AccountCenter,
                        props: route => ({
                            user_card: route.meta.user_card
                        }),
                        meta: {
                            user_card: null
                        }
                    },
                    {
                        path: 'thong-tin-tai-khoan',
                        name: 'AccountInfo',
                        component: AccountInfo,
                        props: route => ({
                            user_info: route.meta.user_info
                        }),
                        meta: {
                            user_info: null,
                            feature: "Chỉnh sửa thông tin cá nhân",
                            keywords: [
                                'thong tin ca nhan',
                                'thông tin cá nhân',
                                'profile',
                                'personal info',
                                'ảnh hồ sơ',
                                'avatar',
                                'profile photo',
                                'photo',
                                'hồ sơ',
                                'họ tên',
                                'họ và tên',
                                'fullname',
                                'full name',
                                'loại hình đăng ký',
                                'registration type',
                                'ngày sinh',
                                'birthday',
                                'date of birth',
                                'giới tính',
                                'gender',
                                'nam',
                                'male',
                                'số điện thoại', 'sdt',
                                'phone',
                                'telephone',
                                'địa chỉ',
                                'address',
                                'edit info',
                                'chỉnh sửa',
                                'cập nhật thông tin'
                            ]

                        }
                    },
                    {
                        path: 'bao-mat',
                        name: 'Security',
                        component: Security,
                        props: route => ({
                            maskEmail: route.meta.maskEmail
                        }),
                        meta: {
                            maskEmail: "",
                            feature: "Đăng nhập và mật khẩu",
                            keywords: [
                                'doi mat khau',
                                'mat khau',
                                'mật khẩu',
                                'đăng nhập',
                                'login',
                                'security',
                                'bảo mật',
                                'thay đổi email',
                                'đổi email',
                                'change email',
                                'đổi mật khẩu',
                                'change password',
                                'reset password',
                                'quên mật khẩu',
                                'forgot password',
                                'quên pass',
                                'authentication'
                            ]
                        }
                    },
                    {
                        path: 'thanh-toan',
                        name: 'payment',
                        component: Payment,
                        meta: {
                            feature: "Gói dịch vụ và thanh toán",
                            keywords: [
                                'thanh toán',
                                'payment',
                                'tien',
                                'tiền',
                                'balance',
                                'số dư tài khoản',
                                'nạp tiền',
                                'nap tien',
                                'add balance',
                                'deposit',
                                'rút tiền',
                                'rut tien',
                                'withdraw',
                                'tài khoản ngân hàng',
                                'bank account',
                                'thống kê chi tiêu',
                                'thong ke chi tieu',
                                'chart',
                                'biểu đồ',
                                'chi tiêu tháng',
                                'lịch sử giao dịch',
                                'transaction history'
                            ]
                        }
                    },
                    {
                        path: 'service-package',
                        name: 'service-package',
                        component: ServicePackageSystem,
                        meta: {
                            feature: "Gói dịch vụ",
                            keywords: [
                                'goi dich vu',
                                'gói dịch vụ',
                                'nâng cấp gói',
                                'upgrade plan',
                                'membership',
                                'lịch sử gói',
                                'lịch sử đăng ký gói',
                                'plan history',
                                'hủy đăng ký gói',
                                'cancel membership',
                                'service',
                            ]
                        }
                    },
                    {
                        path: 'goi-dich-vu',
                        name: 'service-package',
                        component: ServicePackageSystem,
                    },
                    {
                        path: 'thanh-toan/lich-su-giao-dich',
                        name: 'transaction-history',
                        component: TransactionHistory
                    },
                    {
                        path: 'goi-dich-vu-thanh-toan/quyen-loi-goi',
                        name: 'package-benefits',
                        component: PackageBenefits
                    },
                    {
                        path: 'ho-tro',
                        name: 'Support',
                        component: Support,
                        meta: {
                            maskEmail: "",
                            feature: "Hỗ trợ",
                            keywords: [
                                'support',
                                'báo lỗi',
                                'hỗ trợ',
                                'trợ giúp',
                                'faq',
                                'hướng dẫn sử dụng',
                                'hdsd',
                                'how to use'
                            ]
                        }
                    }
                ]
            }
        ]
    },
    {
        path: "/hop-tac",
        name: "Investments",
        component: MenuUser,
        meta: {requiresAuth: false},
        children: [
            {
                path: "",
                name: 'investments',
                component: Investments,
            },
            {
                path: ":id",
                name: "investment-detail",
                component: InvestmentDetail
            }
        ]
    },
    {
        path: "/hop-tac/thanh-toan/:packageId",
        name: "InvestmentPayment",
        component: InvestmentPayment,
        meta: {requiresAuth: true, loginFrom: "user"},
    },
    {
        path: "/hop-tac/goi-hop-tac-da-dang-ky",
        name: "invested",
        component: MenuUser,
        children: [
            {
                path: "",
                name: "invested_investments",
                component: Invested
            }
        ]
    },
    {
        path: "/-thg/quan-ly-nha-dau-tu",
        name: "InvestorManagement",
        component: Menu,
        children: [
            {
                path: "",
                name: "investor-management",
                component: InvestorManagement
            }
        ]
    },
    {
        path: "/",
        name: "Home",
        component: Layout,
        meta: {
            enableTailwind: true,
            newCustomScroll: true,
            useAOS: true,
            requiresAuth: false,
        },
        children: [
            {
                path: '',
                name: "home",
                component: MainContentHome
            },
            {
                path: 'ban-nhanh-bds',
                name: "quickSaleNew",
                component: QuickSale30D
            },
            {
                path: 'dinh-gia-bat-dong-san',
                name: 'ESNew',
                component: ESNew
            },
            {
                path: 'quan-ly-nhom',
                name: 'TeamManagement',
                component: TeamManagement
            },
            {
                path: 'quan-ly-tai-san',
                name: 'PropertyManagement',
                component: PropertyManagement
            },
            {
                path: 'quan-ly-du-an',
                name: 'ProjectManagement',
                component: Projectmanagement
            },
            {
                path: 'ung-tuyen-cong-tac-vien',
                name: 'CTVRecruitment',
                component: CTVRecruit
            },
            {
                path: 'goi-dich-vu-thg',
                name: 'ServicePackageTHG',
                component: ServicePackages
            }
        ]
    },
    {
        path: '/-thg/quan-ly-bao-cao',
        name: 'ReportManagement',
        component: Menu,
        meta: {requiresAuth: true},
        children: [
            {
                path: '',
                name: 'report-management',
                component: ProductReportManagemnet
            }
        ]
    },
    {
        path: '/-thg/quan-ly-lien-he',
        name: 'ContactManagement',
        component: Menu,
        meta: {requiresAuth: true},
        children: [
            {
                path: '',
                name: 'contact-managemnet',
                component: ContactManagement
            }
        ]
    },
    {
        path: "/ga4-demo",
        name: "GA4Demo",
        component: MenuUser,
        meta: {requiresAuth: false},
        children: [
            {
                path: '',
                name: 'ga4-demo',
                component: Ga4EventExample,
                meta: {hideFooterMap: true}
            }
        ]
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: "/"
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return {top: 0}
    }
});


router.beforeEach((to, from, next) => {
    console.group(`=== Navigation từ "${from.fullPath || '/'}" đến "${to.fullPath}" ===`)

    const auth = useAuthStore()
    const isLoggedIn = !!auth.accessToken
    const loginFrom = localStorage.getItem('loginFrom')

    console.log('1. Trạng thái hiện tại:')
    console.log('   - isLoggedIn:', isLoggedIn)
    console.log('   - to.meta.requiresAuth:', to.meta.requiresAuth)
    console.log('   - to.meta.loginFrom:', to.meta.loginFrom)

    // ===== ROUTE CẦN ĐĂNG NHẬP =====
    if (to.meta.requiresAuth && !isLoggedIn) {
        console.log('2. Route yêu cầu xác thực nhưng CHƯA đăng nhập')

        localStorage.setItem('redirectUrl', to.fullPath)

        if (to.meta.loginFrom === 'user') {
            console.log('3. Login dạng USER → mở modal')

            localStorage.setItem('loginFrom', 'user')
            auth.openLoginModal()

            console.groupEnd()
            return next(false) // chặn route, nhưng UI vẫn render
        }

        console.log('3. Login dạng ADMIN → redirect page')
        localStorage.setItem('loginFrom', 'admin')

        console.groupEnd()
        return next('/-thg/dang-nhap')
    }

    // ===== ĐÃ ĐĂNG NHẬP =====
    if (to.meta.requiresAuth && isLoggedIn) {
        localStorage.setItem(
            'loginFrom',
            to.meta.loginFrom === 'user' ? 'user' : 'admin'
        )
    }

    // ===== ĐÃ LOGIN MÀ VÀO TRANG LOGIN =====
    if (
        (to.path === '/-thg/dang-nhap' || to.path === '/dang-nhap') &&
        isLoggedIn
    ) {
        console.log('4. Đã đăng nhập mà vào trang login')

        if (loginFrom === 'user') {
            console.groupEnd()
            return next('/')
        }

        if (loginFrom === 'admin') {
            console.groupEnd()
            return next('/-thg/quan-ly')
        }
    }

    console.log('5. Cho phép navigation')
    console.groupEnd()
    next()
})


router.afterEach((to, from, failure) => {
    // Nếu có failure hoặc navigation không thành công, không xử lý tailwind
    if (failure) {
        return;
    }

    /*
        console.log("Bắt đầu kiểm tra tailwind");
        const id = "tailwind-admin-css";
        let link = document.getElementById(id);
        const needTailwind = to.matched.some(r => r.meta.enableTailwind);

        if (needTailwind && !link) {
            console.log(to.path + " Cần tailwind");
            link = document.createElement("link");
            link.id = id;
            link.rel = "stylesheet";
            link.href = "/tailwind-admin-compiled.css";
            document.head.appendChild(link);
        }

        if (!needTailwind && link) {
            console.log(to.path + " Không cần tailwind");
            link.remove();
        }
    */


    // Kiểm tra để add style cho scroll
    const cls = "use-custom-scroll";
    if (to.meta.newCustomScroll) {
        document.body.classList.add(cls);
    } else {
        document.body.classList.remove(cls);
    }
});
export default router;

