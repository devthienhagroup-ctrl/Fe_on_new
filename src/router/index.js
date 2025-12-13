import {createRouter, createWebHistory} from "vue-router";
import LoginForm from "../components/LoginForm.vue";
import {useAuthStore} from "../stores/authStore.js";
import Menu from "../components/Menu.vue";
import EmployeeManager from "../components/EmployeeManager.vue";
import DepartmentManager from "../components/DepartmentManager.vue";
import Project from "../components/Project.vue";// import store Pinia
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
import Demo from "../components/productAdmin/Demo.vue";
import ProductUpdate  from "../components/productAdmin/ProductUpdate.vue";
import ProductDetail2 from "../components/productAdmin/ProductDetail2.vue";
import ProductCreate from "../components/productAdmin/ProductCreate.vue";

import Ga4EventExample from "../components/Ga4EventExample.vue";
import PaymentPage2 from "../components/productAdmin/PaymentPage2.vue";

const routes = [
        {
            path: "/-thg/dang-nhap",
            name: "LoginForm",
            component: LoginForm,
        },
        {
            path: "/-thg/quan-ly-san-pham/tao-moi",
            meta: {requiresAuth: false},
            name: "ProductCreate",
            component: ProductCreate,
        },
        {
            path: "/-thg/quan-ly-san-pham",
            meta: {requiresAuth: false},
            component: Menu,
            children: [
                {
                    path: "",   // → /-thg/quan-ly-san-phams/:id
                    name: "ProductList",
                    component: ProductList,
                    props: true,
                }
            ]
        },
        {
            path: "/-thg/quan-ly-san-pham",
            meta: {requiresAuth: false},
            component: Menu,
            children: [
                {
                    path: "cap-nhat/:id",   // → /-thg/quan-ly-san-phams/:id
                    name: "ProducUpdate",
                    component: ProductUpdate,
                    props: true,
                }
            ]
        },

        {
            path: "/san-pham-thien-ha",
            meta: {requiresAuth: false, hideFooterMap: true},
            component: MenuUser,
            children: [
                {
                    path: "",   // → /-thg/quan-ly-san-phams/:id
                    name: "Demo",
                    component: Demo,
                    props: true,
                }
            ]
        },
        {
        path: "/-thg/quan-ly-san-pham",
        component: Menu,       // ⭐ Bổ sung MENU tại đây
        meta: { requiresAuth: false, hideFooterMap: true },

        children: [
            {
                path: ":id",   // → /-thg/quan-ly-san-phams/:id
                name: "ProductDetail",
                component: ProductDetail,
                props: true,
            }
        ],

    },
    {
        path: "/san-pham-thien-ha",
        component: MenuUser,       // ⭐ Bổ sung MENU tại đây
        meta: { requiresAuth: false },

        children: [
            {
                path: ":id",   // → /-thg/quan-ly-san-phams/:id
                name: "ProductDetail2",
                component: ProductDetail2,
                props: true,
            }
        ],

    },
        {
            path: "/-thg/loai-hinh",
            component: Menu, // MenuUser là layout chính
            meta: {requiresAuth: true,  loginFrom: "admin"},
            children: [
                {
                    path: '', // path rỗng nghĩa là /employee sẽ hiển thị EmployeeManager
                    name: 'TypeManager',
                    component: TypeManager
                }
            ]// 🔒 route này yêu cầu đăng nhập
        },
        {
            path: "/-thg/nhom",
            component: Menu, // MenuUser là layout chính
            meta: {requiresAuth: true,  loginFrom: "admin"},
            children: [
                {
                    path: '', // path rỗng nghĩa là /employee sẽ hiển thị EmployeeManager
                    name: 'TeamManager',
                    component: TeamManager
                }
            ] // 🔒 route này yêu cầu đăng nhập
        },
        {
            path: '/-thg/nhan-vien',
            component: Menu, // MenuUser là layout chính
            meta: {requiresAuth: true,  loginFrom: "admin"},
            children: [
                {
                    path: '', // path rỗng nghĩa là /employee sẽ hiển thị EmployeeManager
                    name: 'EmployeeManager',
                    component: EmployeeManager
                }
            ]
        },
        {
            path: '/-thg/phong-ban',
            component: Menu, // MenuUser là layout chính
            meta: {requiresAuth: true,  loginFrom: "admin"},
            children: [
                {
                    path: '', // path rỗng nghĩa là /employee sẽ hiển thị EmployeeManager
                    name: 'DepartmentManager',
                    component: DepartmentManager
                }
            ]
        },
        {
            path: '/-thg/dich-vu',
            component: Menu, // MenuUser là layout chính
            meta: {requiresAuth: true,  loginFrom: "admin"},
            children: [
                {
                    path: '', // path rỗng nghĩa là /employee sẽ hiển thị EmployeeManager
                    name: 'ServiceManager',
                    component: ServiceManager
                }
            ]
        },
        {
            path: '/-thg/phan-quyen',
            component: Menu, // MenuUser là layout chính
            meta: {requiresAuth: true,  loginFrom: "admin"},
            children: [
                {
                    path: '', // path rỗng nghĩa là /employee sẽ hiển thị EmployeeManager
                    name: 'RolePermissionManager',
                    component: RolePermissionManager
                }
            ]
        },
        {
            path: '/-thg/khach-hang',
            component: Menu, // MenuUser là layout chính
            meta: {requiresAuth: true,  loginFrom: "admin"},
            children: [
                {
                    path: '', // path rỗng nghĩa là /employee sẽ hiển thị EmployeeManager
                    name: 'CustomerManager',
                    component: CustomerManager
                }
            ]
        },
        {
            path: '/-thg/dinh-gia',
            component: Menu, // MenuUser là layout chính
            meta: {requiresAuth: true,  loginFrom: "admin"},
            children: [
                {
                    path: '', // path rỗng nghĩa là /employee sẽ hiển thị EmployeeManager
                    name: 'AdminValuationManager',
                    component: AdminValuationManager
                }
            ]
        },
        {
            path: '/bao-cao-dinh-gia',
            component: MenuUser, // MenuUser là layout chính
            meta: {requiresAuth: true,  loginFrom: "user", hideFooterMap: true},
            children: [
                {
                    path: '', // path rỗng nghĩa là /employee sẽ hiển thị EmployeeManager
                    name: 'MyValuationManager',
                    component: MyValuationManager
                }
            ]
        },
        {
            path: '/-thg/goi-he-thong',
            component: Menu, // MenuUser là layout chính
            meta: {requiresAuth: true,  loginFrom: "admin"},
            children: [
                {
                    path: '', // path rỗng nghĩa là /employee sẽ hiển thị EmployeeManager
                    name: 'servicesystem',
                    component: ServiceSystemManager
                }
            ]
        },
        {
            path: '/-thg/lich-hen',
            component: Menu, // MenuUser là layout chính
            meta: {requiresAuth: true,  loginFrom: "admin"},
            children: [
                {
                    path: '', // path rỗng nghĩa là /employee sẽ hiển thị EmployeeManager
                    name: 'AppointmentManager',
                    component: AppointmentManager
                }
            ]
        },
        {
            path: '/nhom-cua-toi',
            component: MenuUser, // MenuUser là layout chính
            meta: {requiresAuth: true,  loginFrom: "user", hideFooterMap: true},
            children: [
                {
                    path: '', // path rỗng nghĩa là /employee sẽ hiển thị EmployeeManager
                    name: 'myTeamUser',
                    component: MyTeamMain
                }
            ]
        },
        {
            path: '/-thg/lich-su-he-thong',
            component: Menu, // MenuUser là layout chính
            meta: {requiresAuth: true,  loginFrom: "admin"},
            children: [
                {
                    path: '', // path rỗng nghĩa là /employee sẽ hiển thị EmployeeManager
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
            component: Menu, // MenuUser là layout chính
            meta: {requiresAuth: true,  loginFrom: "admin"},
            children: [
                {
                    path: '', // path rỗng nghĩa là /employee sẽ hiển thị EmployeeManager
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
            path: "/",
            name: "Landinngpage",
            component: MenuUser,
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
                showQSPopup: true
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
            path: "/dang-nhap",
            name: "LoginUser",
            component: MenuUser,
            meta: { loginFrom: "user"},
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
        children: [
            {
                path: '',
                name: 'checkout',
                component: PaymentPage,
                meta: {hideFooterMap: true}
            }
        ]
    },
    {
        path: "/thanh-toan-san-pham",
        name: "Checkout",
        component: MenuUser,
        children: [
            {
                path: '',
                name: 'checkout',
                component: PaymentPage2,
                meta: {hideFooterMap: true}
            }
        ]
    },
        {
            path: "/tin-tuc",
            name: "News",
            component: MenuUser,
            children: [
                {
                    path: '',
                    name: 'news',
                    component: News
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
        path: "/ho-so",
        name: "Profile",
        meta: {requiresAuth: true,  loginFrom: "user", hideFooterMap: true},
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
        path: "/ga4-demo",
        name: "GA4Demo",
        component: MenuUser,
        children: [
            {
                path: '',
                name: 'ga4-demo',
                component: Ga4EventExample,
                meta: { hideFooterMap: true }
            }
        ]
    },
        {
            path: "/:pathMatch(.*)*",
            redirect:
                "/", // nếu URL không hợp lệ → về login
        }
        ,
    ]
;

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // Nếu dùng nút back/forward trình duyệt
        if (savedPosition) {
            return savedPosition
        }

        // Mặc định luôn cuộn lên đầu trang
        return { top: 0 }
    }
});

// 🧩 Guard kiểm tra đăng nhập trước khi vào trang
router.beforeEach((to, from, next) => {
    const auth = useAuthStore();
    const isLoggedIn = !!auth.accessToken;

    // Lấy loginFrom từ localStorage (rất quan trọng)
    const loginFrom = localStorage.getItem("loginFrom"); // "admin" hoặc "user"

    // Nếu route yêu cầu đăng nhập
    if (to.meta.requiresAuth) {
        if (!isLoggedIn) {

            // ⭐ LƯU URL user định vào
            localStorage.setItem("redirectUrl", to.fullPath);

            // Chưa login → đẩy về login đúng portal
            if (to.meta.loginFrom === "user") {
                localStorage.setItem("loginFrom", "user");
                return next("/dang-nhap");
            } else {
                localStorage.setItem("loginFrom", "admin");
                return next("/-thg/dang-nhap");
            }
        }else{
            if (to.meta.loginFrom === "user") {
                localStorage.setItem("loginFrom", "user");
            } else {
                localStorage.setItem("loginFrom", "admin");
            }
        }
    }

    // Nếu đã login mà vẫn vào /-thg/dang-nhap hoặc /dang-nhap
    if ((to.path === "/-thg/dang-nhap" || to.path === "/dang-nhap") && isLoggedIn) {
        if (loginFrom === "user") {
            return next("/");
        }
        if (loginFrom === "admin") {
            return next("/-thg/quan-ly");
        }
    }

    next();
});


export default router;


