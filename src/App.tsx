import React, { useEffect, useMemo, useState } from 'react';
import heroImage from './assets/login-hero-clean.png';
import companyLogo from './assets/our-real-estate-logo.png';
import {
  createClient,
  type Session,
} from '@supabase/supabase-js';

const SUPABASE_URL =
  'https://zadirsdomdlzcgugkjub.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_Lmg5UHcAHbcN5Jw__82o3w_JQueY9Yx';

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

type RoleName =
  | 'Admin'
  | 'Shareholder'
  | 'Employee'
  | 'Accountant'
  | 'Manager'
  | 'Visitor';

type Page =
  | 'dashboard'
  | 'shareholders'
  | 'shares'
  | 'shareholder-share'
  | 'share-settings'
  | 'share-transfer'
  | 'shareholder-documents'
  | 'shareholder-payments'
  | 'shareholder-dividends'
  | 'my-share-details'
  | 'investments'
  | 'customers'
  | 'projects'
  | 'properties'
  | 'booking'
  | 'payments'
  | 'dividend'
  | 'notices'
  | 'company-policy'
  | 'reports'
  | 'administration';

type GenericRow = Record<string, any>;

type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'textarea'
  | 'select';

type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: Array<{
    value: string | number;
    label: string;
  }>;
};

type GenericConfig = {
  title: string;
  table: string;
  fields: FieldConfig[];
};

type EditingState = {
  table: string;
  row: GenericRow;
} | null;

type ShareholderForm = {
  company_shareholder_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  national_id: string;
  profession: string;
  address: string;

  company_share_id: string;
  share_quantity: string;
  share_type: string;
  share_price: string;

  deposit_amount: string;
  join_date: string;
  note: string;
};

type ShareholderShareForm = {
  shareholder_id: string;
  share_type_id: string;
  company_share_id: string;
  quantity: string;
  share_price: string;
  start_date: string;
  end_date: string;
  status: string;
  notes: string;
};

type TransferItem = {
  share_id: string;
  shareholder_share_id: string;
  quantity: string;
  purchase_value: string;
};

const allPages: Page[] = [
  'dashboard',
  'shareholders',
  'shares',
  'shareholder-share',
  'share-settings',
  'share-transfer',
  'shareholder-documents',
  'shareholder-payments',
  'shareholder-dividends',
  'my-share-details',
  'investments',
  'customers',
  'projects',
  'properties',
  'booking',
  'payments',
  'dividend',
  'notices',
  'company-policy',
  'reports',
  'administration',
];

const roleAccess: Record<RoleName, Page[]> = {
  Admin: allPages,

  Shareholder: [
    'dashboard',
    'shares',
    'shareholder-share',
    'my-share-details',
    'share-transfer',
    'shareholder-documents',
    'shareholder-payments',
    'shareholder-dividends',
    'notices',
    'company-policy',
  ],

  Employee: [
    'dashboard',
    'shareholders',
    'shares',
    'shareholder-share',
    'share-settings',
    'share-transfer',
    'shareholder-documents',
    'shareholder-payments',
    'shareholder-dividends',
    'investments',
    'customers',
    'projects',
    'properties',
    'booking',
    'payments',
    'notices',
    'company-policy',
    'dividend',
    'reports',
  ],

  Accountant: [
    'dashboard',
    'shareholders',
    'shares',
    'shareholder-share',
    'share-transfer',
    'shareholder-payments',
    'shareholder-dividends',
    'payments',
    'dividend',
    'reports',
  ],

  Manager: [
    'dashboard',
    'shareholders',
    'shares',
    'shareholder-share',
    'share-settings',
    'share-transfer',
    'shareholder-documents',
    'shareholder-payments',
    'shareholder-dividends',
    'investments',
    'customers',
    'projects',
    'properties',
    'booking',
    'payments',
    'notices',
    'company-policy',
    'dividend',
    'reports',
  ],

  Visitor: [
    'dashboard',
    'projects',
    'properties',
    'notices',
    'company-policy',
  ],
};

const menuSections: Array<{
  title: string;
  items: Array<{
    page: Page;
    label: string;
    icon: string;
  }>;
}> = [
  {
    title: 'Share Administration',
    items: [
      {
        page: 'shareholders',
        label: 'Shareholders',
        icon: '👥',
      },
      {
        page: 'shares',
        label: 'Shares',
        icon: '📊',
      },
      {
        page: 'shareholder-share',
        label: 'Shareholder Share',
        icon: '📑',
      },
      {
        page: 'share-settings',
        label: 'Share Settings',
        icon: '⚙️',
      },
      {
        page: 'share-transfer',
        label: 'Share Transfer',
        icon: '🔄',
      },
      {
        page: 'shareholder-documents',
        label: 'Shareholder Documents',
        icon: '📁',
      },
      {
        page: 'shareholder-payments',
        label: 'Shareholder Payments',
        icon: '💳',
      },
      {
        page: 'shareholder-dividends',
        label: 'Shareholder Dividends',
        icon: '💰',
      },
      {
        page: 'my-share-details',
        label: 'My Share Details',
        icon: '🔎',
      },
    ],
  },

  {
    title: 'Company Administration',
    items: [
      {
        page: 'investments',
        label: 'Investments',
        icon: '📈',
      },
      {
        page: 'customers',
        label: 'Customers',
        icon: '🧑‍💼',
      },
      {
        page: 'projects',
        label: 'Projects',
        icon: '🏗️',
      },
      {
        page: 'properties',
        label: 'Properties',
        icon: '🏠',
      },
      {
        page: 'booking',
        label: 'Booking',
        icon: '📅',
      },
      {
        page: 'payments',
        label: 'Payments',
        icon: '💵',
      },
      {
        page: 'dividend',
        label: 'Dividend',
        icon: '🪙',
      },
      {
        page: 'notices',
        label: 'Notices',
        icon: '📢',
      },
      {
        page: 'company-policy',
        label: 'Company Policy',
        icon: '📜',
      },
      {
        page: 'reports',
        label: 'Reports',
        icon: '📋',
      },
      {
        page: 'administration',
        label: 'Administration',
        icon: '🛠️',
      },
    ],
  },
];

const genericConfigs: Record<string, GenericConfig> = {
  customers: {
    title: 'Customers',
    table: 'customers',
    fields: [
      {
        key: 'name',
        label: 'Customer Name',
        type: 'text',
        required: true,
      },
      {
        key: 'phone',
        label: 'Phone Number',
        type: 'text',
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
      },
      {
        key: 'nid',
        label: 'National ID',
        type: 'text',
      },
      {
        key: 'address',
        label: 'Address',
        type: 'text',
      },
    ],
  }, 

  project: {
    title: 'Projects',
    table: 'projects',
    fields: [
      {
        key: 'name',
        label: 'Project Name',
        type: 'text',
        required: true,
      },
      {
        key: 'location',
        label: 'Location',
        type: 'text',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'text',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'text',
      },
    ],
  },

  properties: {
    title: 'Properties',
    table: 'properties',
    fields: [
      {
        key: 'project_id',
        label: 'Project ID',
        type: 'number',
        required: true,
      },
      {
        key: 'property_type',
        label: 'Property Type',
        type: 'text',
        required: true,
      },
      {
        key: 'property_no',
        label: 'Property No',
        type: 'text',
      },
      {
        key: 'floor',
        label: 'Floor',
        type: 'text',
      },
      {
        key: 'size',
        label: 'Size',
        type: 'number',
      },
      {
        key: 'price',
        label: 'Price',
        type: 'number',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'text',
      },
    ],
  },

  booking: {
    title: 'Booking',
    table: 'bookings',
    fields: [
      {
        key: 'customer_id',
        label: 'Customer ID',
        type: 'number',
      },
      {
        key: 'property_id',
        label: 'Property ID',
        type: 'number',
      },
      {
        key: 'booking_date',
        label: 'Booking Date',
        type: 'date',
      },
      {
        key: 'booking_amount',
        label: 'Booking Amount',
        type: 'number',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'text',
      },
    ],
  },

  payments: {
    title: 'Payments',
    table: 'payments',
    fields: [
      {
        key: 'booking_id',
        label: 'Booking ID',
        type: 'number',
      },
      {
        key: 'amount',
        label: 'Amount',
        type: 'number',
      },
      {
        key: 'payment_date',
        label: 'Payment Date',
        type: 'date',
      },
      {
        key: 'payment_method',
        label: 'Payment Method',
        type: 'text',
      },
      {
        key: 'reference',
        label: 'Reference',
        type: 'text',
      },
      {
        key: 'notes',
        label: 'Notes',
        type: 'textarea',
      },
    ],
  },

  notices: {
    title: 'Notices',
    table: 'notices',
    fields: [
      {
        key: 'title',
        label: 'Notice Title',
        type: 'text',
        required: true,
      },
      {
        key: 'message',
        label: 'Notice Message',
        type: 'textarea',
        required: true,
      },
    ],
  },
  notice_deliveries: {
    title: 'Notice Delivery & Evidence',
    table: 'notice_deliveries',
    fields: [
      {
        key: 'notice_id',
        label: 'Notice ID',
        type: 'number',
        required: true,
      },
      {
        key: 'recipient_type',
        label: 'Recipient Type',
        type: 'text',
        required: true,
      },
      {
        key: 'recipient_id',
        label: 'Recipient ID',
        type: 'number',
      },
      {
        key: 'recipient_name',
        label: 'Recipient Name',
        type: 'text',
        required: true,
      },
      {
        key: 'delivery_date',
        label: 'Delivery Date',
        type: 'date',
        required: true,
      },
      {
        key: 'delivery_method',
        label: 'Delivery Method',
        type: 'text',
        required: true,
      },
      {
        key: 'status',
        label: 'Status',
        type: 'text',
        required: true,
      },
      {
        key: 'evidence_url',
        label: 'Evidence URL',
        type: 'text',
      },
      {
        key: 'reference',
        label: 'Reference',
        type: 'text',
      },
      {
        key: 'notes',
        label: 'Notes',
        type: 'textarea',
      },
    ],
  },

  company_policy: {
    title: 'Company Policy',
    table: 'company_policies',
    fields: [
      {
        key: 'title',
        label: 'Policy Title',
        type: 'text',
        required: true,
      },
      {
        key: 'policy_type',
        label: 'Policy Type',
        type: 'text',
        required: true,
      },
      {
        key: 'content',
        label: 'Policy Content',
        type: 'textarea',
        required: true,
      },
      {
        key: 'effective_date',
        label: 'Effective Date',
        type: 'date',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'text',
        required: true,
      },
    ],
  },

  dividend: {
    title: 'Dividend',
    table: 'dividends',
    fields: [
      {
        key: 'dividend_year',
        label: 'Dividend Year',
        type: 'number',
      },
      {
        key: 'dividend_rate',
        label: 'Dividend Rate Per Share',
        type: 'number',
      },
      {
        key: 'declaration_date',
        label: 'Declaration Date',
        type: 'date',
      },
      {
        key: 'payment_date',
        label: 'Payment Date',
        type: 'date',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
          {
            value: 'pending',
            label: 'Pending',
          },
          {
            value: 'declared',
            label: 'Declared',
          },
          {
            value: 'paid',
            label: 'Paid',
          },
        ],
      },
      {
        key: 'notes',
        label: 'Notes',
        type: 'textarea',
      },
    ],
  },

  company_share_configuration: {
    title: 'Company Share Configuration',
    table: 'company_share_configuration',
    fields: [
      {
        key: 'total_share',
        label: 'Total Share',
        type: 'number',
        required: true,
      },
      {
        key: 'share_price',
        label: 'Share Price',
        type: 'number',
        required: true,
      },
      {
        key: 'currency',
        label: 'Currency',
        type: 'text',
      },
    ],
  },
};

const normalizeRole = (value: any): RoleName => {
  const text = String(value ?? '').trim().toLowerCase();

  if (text === 'admin' || text === 'administrator') {
    return 'Admin';
  }

  if (text === 'shareholder') {
    return 'Shareholder';
  }

  if (text === 'employee') {
    return 'Employee';
  }

  if (text === 'accountant') {
    return 'Accountant';
  }

  if (text === 'manager') {
    return 'Manager';
  }

  return 'Visitor';
};

const todayString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatMoney = (value: any) => {
  const number = Number(value ?? 0);

  if (!Number.isFinite(number)) {
    return '৳0';
  }

  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(number);
};

const emptyShareholderForm: ShareholderForm = {
  company_shareholder_id: '',
  user_id: '',
  full_name: '',
  email: '',
  phone_number: '',
  national_id: '',
  profession: '',
  address: '',
  company_share_id:'',
  share_quantity: '',
  share_type: '',
  share_price: '',
  deposit_amount: '',
  join_date: todayString(),
  note: '',
};

const emptyShareholderShareForm: ShareholderShareForm = {
  shareholder_id: '',
  share_type_id: '',
  company_share_id: '',
  quantity: '',
  share_price: '',
  start_date: todayString(),
  end_date: '',
  status: 'active',
  notes: '',
};

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
  disabled = false,
}: {
  label: string;
  value: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {required ? ' *' : ''}
      </span>

      <input
        className="form-input"
        type={type}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
}: {
  label: string;
  value: any;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {required ? ' *' : ''}
      </span>

      <textarea
        className="form-input min-h-[100px]"
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
}: {
  label: string;
  value: any;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{
    value: string | number;
    label: string;
  }>;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {required ? ' *' : ''}
      </span>

      <select
        className="form-input"
        value={value ?? ''}
        onChange={onChange}
        required={required}
        disabled={disabled}
      >
        <option value="">Select...</option>

        {options.map((option) => (
          <option
            key={String(option.value)}
            value={String(option.value)}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family:
          Inter,
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
        background: #f1f5f9;
        color: #0f172a;
      }

      button,
      input,
      select,
      textarea {
        font: inherit;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }

      .field-label {
        font-size: 13px;
        font-weight: 600;
        color: #334155;
      }

      .form-input {
        width: 100%;
        min-height: 42px;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 9px 12px;
        outline: none;
        background: #fff;
        color: #0f172a;
      }

      .form-input:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, .10);
      }

      .form-input:disabled {
        background: #f8fafc;
        color: #64748b;
      }

      .scrollbar-thin::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }

      .scrollbar-thin::-webkit-scrollbar-thumb {
        background: #94a3b8;
        border-radius: 999px;
      }
    `}</style>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [page, setPage] = useState<Page>('dashboard');

  const [currentUserRole, setCurrentUserRole] =
    useState<RoleName>('Visitor');

  const [userRoles, setUserRoles] = useState<GenericRow[]>([]);
  const [rows, setRows] = useState<Record<string, GenericRow[]>>(
    {}
  );

  const [shareholders, setShareholders] = useState<
    GenericRow[]
  >([]);

  const [shareTypes, setShareTypes] = useState<GenericRow[]>(
    []
  );

  const [shareConfig, setShareConfig] =
    useState<GenericRow | null>(null);

  const [shareTransfers, setShareTransfers] = useState<
    GenericRow[]
  >([]);

  const [myShareDetails, setMyShareDetails] = useState<
    GenericRow[]
  >([]);

  const [dashboardSummary, setDashboardSummary] = useState<{
    total_shareholders: number;
    allocated_shares: number;
  }>({
    total_shareholders: 0,
    allocated_shares: 0,
  });

  const [loadingData, setLoadingData] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [editing, setEditing] =
    useState<EditingState>(null);

  const [genericForm, setGenericForm] =
    useState<GenericRow>({});

  const [selectedShareholder, setSelectedShareholder] =
    useState<GenericRow | null>(null);

  const [shareholderForm, setShareholderForm] =
    useState<ShareholderForm>(emptyShareholderForm);

  const [showShareholderForm, setShowShareholderForm] =
    useState(false);

  const [creatingShareholderAccount, setCreatingShareholderAccount] =
  useState(false);

  const [shareholderAccountCreated, setShareholderAccountCreated] =
  useState(false);

  const [shareholderShareForm, setShareholderShareForm] =
    useState<ShareholderShareForm>(
      emptyShareholderShareForm
    );

  const [editingShareholderShare, setEditingShareholderShare] =
    useState<GenericRow | null>(null);

  const [showShareholderShareForm, setShowShareholderShareForm] =
    useState(false);

  const [shareholderShares, setShareholderShares] = useState<
    GenericRow[]
  >([]);

  const [shareTransferRequestType, setShareTransferRequestType] =
    useState<
      'Share Transfer' | 'Share Withdrawal' | 'Share Closure'
    >('Share Transfer');

  const [shareTransferApplicant, setShareTransferApplicant] =
    useState('');

  const [shareTransferFrom, setShareTransferFrom] =
    useState('');

  const [shareTransferTo, setShareTransferTo] =
    useState('');

  const [shareTransferQuantity, setShareTransferQuantity] =
    useState('');

  const [shareTransferDate, setShareTransferDate] =
    useState(todayString());

  const [shareTransferNote, setShareTransferNote] =
    useState('');

  const [withdrawalBeneficiaryName, setWithdrawalBeneficiaryName] =
    useState('');

  const [withdrawalBeneficiaryAccount, setWithdrawalBeneficiaryAccount] =
    useState('');

  const [withdrawalPaymentMethod, setWithdrawalPaymentMethod] =
    useState('Bank Transfer');

  const [withdrawalSharePrice, setWithdrawalSharePrice] =
    useState('');

  const [withdrawalAvailableQuantity, setWithdrawalAvailableQuantity] =
    useState('');

  const [shareRequestItems, setShareRequestItems] =
    useState<TransferItem[]>([
      {
        share_id: '',
        shareholder_share_id: '',
        quantity: '',
        purchase_value: '',
      },
    ]);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  const currentUserId = session?.user?.id ?? '';

  const accessiblePages = useMemo(() => {
    const rolePages =
      roleAccess[currentUserRole] ??
      roleAccess.Visitor;
  
    const permissionRows =
      rows.permissions ?? [];
  
    const hasPermissionData =
      permissionRows.some(
        (permission: any) =>
          String(permission.role ?? '')
            .trim()
            .toLowerCase() ===
          currentUserRole
            .toLowerCase()
      );
  
    if (!hasPermissionData) {
      return rolePages;
    }
  
    return rolePages.filter((page) => {
      const moduleMap: Record<
        string,
        string
      > = {
        dashboard: 'dashboard',
        shareholders: 'shareholders',
        shares: 'shares',
        'shareholder-share':
          'shareholder-share',
        'share-settings':
          'share-settings',
        'share-transfer':
          'share-transfer',
        'shareholder-documents':
          'shareholder-documents',
        'shareholder-payments':
          'shareholder-payments',
        'shareholder-dividends':
          'shareholder-dividends',
        'my-share-details':
          'my-share-details',
        investments: 'investments',
        customers: 'customers',
        projects: 'projects',
        properties: 'properties',
        booking: 'booking',
        payments: 'payments',
        dividend: 'dividend',
        notices: 'notices',
        'company-policy':
          'company-policy',
        reports: 'reports',
        administration:
          'administration',
      };
  
      const module =
        moduleMap[page];
  
      const permission =
        permissionRows.find(
          (item: any) =>
            String(item.role ?? '')
              .trim()
              .toLowerCase() ===
              currentUserRole.toLowerCase() &&
            String(item.module ?? '')
              .trim()
              .toLowerCase() ===
              String(module ?? '')
                .trim()
                .toLowerCase()
        );
  
      return permission?.can_view === true;
    });
  }, [
    currentUserRole,
    rows.permissions,
  ]);
  
  const visibleMenuSections = useMemo(() => {
    return menuSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          accessiblePages.includes(item.page)
        ),
      }))
      .filter(
        (section) =>
          section.items.length > 0
      );
  }, [accessiblePages]);

  const currentShareholder = useMemo(() => {
    if (!currentUserId) {
      return null;
    }

    return (
      shareholders.find(
        (item) =>
          String(item.user_id ?? '') ===
          String(currentUserId)
      ) ?? null
    );
  }, [shareholders, currentUserId]);

  const getPageTitle = (targetPage: Page) => {
    if (targetPage === 'dashboard') {
      return 'Dashboard';
    }

    for (const section of menuSections) {
      const item = section.items.find(
        (menuItem) => menuItem.page === targetPage
      );

      if (item) {
        return item.label;
      }
    }

    return 'Our Real Estate Company Ltd';
  };

  const navigate = (targetPage: Page) => {
    if (!accessiblePages.includes(targetPage)) {
      setError('You do not have permission to open this page.');
      return;
    }

    clearMessages();
    setPage(targetPage);
    setMobileMenuOpen(false);
  };

  const safeSelect = async (
    table: string,
    select = '*',
    builder?: (query: any) => any
  ) => {
    let query = supabase
      .from(table)
      .select(select);

    if (builder) {
      query = builder(query);
    }

    const result = await query;

    if (result.error) {
      throw result.error;
    }

    return result.data ?? [];
  };

  const loadUserRole = async (userId: string) => {
    try {
      const { data, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);

      if (roleError) {
        throw roleError;
      }

      const list = data ?? [];
      setUserRoles(list);

      const record = list[0];

      const roleValue =
        record?.role_name ??
        record?.role ??
        record?.user_role ??
        record?.name ??
        '';

      const role = normalizeRole(roleValue);

      setCurrentUserRole(role);

      return role;
    } catch (err: any) {
      setUserRoles([]);
      setCurrentUserRole('Visitor');
      setError(
        err?.message ||
          'Unable to load the current user role.'
      );
      return 'Visitor' as RoleName;
    }
  };

  const loadDashboardSummary = async () => {
    try {
      const { data, error: rpcError } =
        await supabase.rpc(
          'get_dashboard_share_summary'
        );

      if (rpcError) {
        throw rpcError;
      }

      const first = Array.isArray(data)
        ? data[0]
        : data;

      setDashboardSummary({
        total_shareholders: Number(
          first?.total_shareholders ?? 0
        ),
        allocated_shares: Number(
          first?.allocated_shares ?? 0
        ),
      });
    } catch {
      const count = shareholders.length;

      const allocated = shareholders.reduce(
        (sum, item) =>
          sum + Number(item.share_quantity ?? 0),
        0
      );

      setDashboardSummary({
        total_shareholders: count,
        allocated_shares: allocated,
      });
    }
  };

  const loadMyShareDetails = async () => {
    try {
      const { data, error: rpcError } =
        await supabase.rpc(
          'get_my_share_details'
        );

      if (rpcError) {
        throw rpcError;
      }

      setMyShareDetails(data ?? []);
    } catch {
      setMyShareDetails([]);
    }
  };

  const loadData = async (
    role: RoleName = currentUserRole,
    userId: string = currentUserId
  ) => {
    if (!userId) {
      return;
    }
  
    setLoadingData(true);
  
    try {
      const nextRows: Record<string, GenericRow[]> = {};
  
      const publicTables = [
        'project',
        'projects',
        'properties',
        'bookings',
        'notices',
        'company_policies',
        'notice_deliveries',
      ];
  
      for (const table of publicTables) {
        try {
          nextRows[table] = await safeSelect(table);
        } catch {
          nextRows[table] = [];
        }
      }
  
      try {
        nextRows.company_share_configuration =
          await safeSelect(
            'company_share_configuration'
          );
      } catch {
        nextRows.company_share_configuration = [];
      }
  
      try {
        nextRows.share_types =
          await safeSelect('share_types');
      } catch {
        nextRows.share_types = [];
      }
  
      let shareholderData: GenericRow[] = [];
  
      try {
        if (role === 'Shareholder') {
          shareholderData = await safeSelect(
            'shareholders',
            '*',
            (query) =>
              query.eq('user_id', userId)
          );
        } else {
          shareholderData =
            await safeSelect('shareholders');
        }
      } catch {
        shareholderData = [];
      }
  
      setShareholders(shareholderData);
      nextRows.shareholders = shareholderData;
  
      const ownShareholder =
        shareholderData.find(
          (item) =>
            String(item.user_id ?? '') ===
            String(userId)
        ) ?? null;
  
      let shareData: GenericRow[] = [];
  
      try {
        if (role === 'Shareholder') {
          if (ownShareholder?.id) {
            shareData = await safeSelect(
              'shareholder_shares',
              '*',
              (query) =>
                query.eq(
                  'shareholder_id',
                  ownShareholder.id
                )
            );
          }
        } else {
          shareData =
            await safeSelect('shareholder_shares');
        }
      } catch {
        shareData = [];
      }
  
      setShareholderShares(shareData);
      nextRows.shareholder_shares = shareData;
  
      let transferData: GenericRow[] = [];
  
      try {
        if (
          role === 'Admin' ||
          role === 'Manager' ||
          role === 'Accountant'
        ) {
          transferData =
            await safeSelect('share_transfers');
        } else if (role === 'Employee') {
          transferData =
            await safeSelect('share_transfers');
        } else if (
          role === 'Shareholder' &&
          ownShareholder?.company_shareholder_id
        ) {
          transferData = await safeSelect(
            'share_transfers',
            '*',
            (query) =>
              query.eq(
                'applicant_shareholder_id',
                ownShareholder.company_shareholder_id
              )
          );
        }
      } catch {
        transferData = [];
      }
  
      setShareTransfers(transferData);
      nextRows.share_transfers = transferData;
  
      console.log(
        'TRANSFER DATA:',
        transferData
      );
  
      console.log(
        'TRANSFER COUNT:',
        transferData.length
      );
  
      /*
       * Load permissions for every authenticated role,
       * including Visitor.
       */
      try {
        nextRows.permissions =
          await safeSelect('permissions');
      } catch {
        nextRows.permissions = [];
      }
  
      if (role !== 'Visitor') {
        const privateTables = [
          'customers',
          'booking',
          'payments',
          'shareholder_documents',
          'shareholder_payments',
          'investments',
        ];
  
        for (const table of privateTables) {
          try {
            nextRows[table] =
              await safeSelect(table);
          } catch {
            nextRows[table] = [];
          }
        }
  
        /*
         * Load company-level dividends
         * from the actual dividends table.
         */
        try {
          nextRows.dividends =
            await safeSelect('dividends');
        } catch {
          nextRows.dividends = [];
        }
  
        /*
         * Load shareholder dividends.
         * Shareholders see only their own records.
         * Admin, Accountant and Employee can see
         * the records allowed by RLS.
         */
        try {
          if (
            role === 'Shareholder' &&
            ownShareholder?.id
          ) {
            nextRows.shareholder_dividends =
              await safeSelect(
                'shareholder_dividends',
                '*',
                (query) =>
                  query.eq(
                    'shareholder_id',
                    ownShareholder.id
                  )
              );
          } else {
            nextRows.shareholder_dividends =
              await safeSelect(
                'shareholder_dividends'
              );
          }
        } catch {
          nextRows.shareholder_dividends = [];
        }
  
        /*
         * Load dividend payment requests.
         *
         * Accountant creates these requests.
         * Admin will use these records later
         * to approve or reject payment requests.
         */
        try {
          nextRows.dividend_payment_requests =
            await safeSelect(
              'dividend_payment_requests'
            );
        } catch {
          nextRows.dividend_payment_requests = [];
        }
  
        if (role === 'Admin') {
          try {
            nextRows.user_roles =
              await safeSelect('user_roles');
          } catch {
            nextRows.user_roles = [];
          }
        }
      }
  
      setRows(nextRows);
  
      const config =
        nextRows.company_share_configuration?.[0] ??
        null;
  
      setShareConfig(config);
  
      setShareTypes(
        nextRows.share_types ?? []
      );
  
      await loadDashboardSummary();
  
      if (role === 'Shareholder') {
        await loadMyShareDetails();
      } else {
        setMyShareDetails([]);
      }
    } catch (err: any) {
      setError(
        err?.message ||
          'Unable to load application data.'
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      setAuthLoading(true);

      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        setSession(initialSession);

        if (initialSession?.user?.id) {
          const role = await loadUserRole(
            initialSession.user.id
          );

          if (mounted) {
            await loadData(
              role,
              initialSession.user.id
            );
          }
        }
      } catch (err: any) {
        if (mounted) {
          setLoginError(
            err?.message ||
              'Unable to initialize authentication.'
          );
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        if (!mounted) {
          return;
        }

        setSession(nextSession);

        if (!nextSession?.user?.id) {
          setCurrentUserRole('Visitor');
          setUserRoles([]);
          setShareholders([]);
          setShareholderShares([]);
          setShareTransfers([]);
          setMyShareDetails([]);
          setRows({});
          setShareConfig(null);
          return;
        }

        const role = await loadUserRole(
          nextSession.user.id
        );

        if (mounted) {
          await loadData(
            role,
            nextSession.user.id
          );
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
  
    clearMessages();
    setLoginError('');
  
    if (!loginEmail.trim() || !loginPassword) {
      setLoginError(
        'Please enter your email and password.'
      );
      return;
    }
  
    setAuthLoading(true);
  
    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword,
        });
  
      if (signInError) {
        throw signInError;
      }
  
      setSession(data.session);
      setLoginPassword('');
  
      if (data.user?.id) {
        const role = await loadUserRole(
          data.user.id
        );
  
        const {
          data: userRoleData,
          error: userRoleError,
        } = await supabase
          .from('user_roles')
          .select('is_active')
          .eq('user_id', data.user.id)
          .maybeSingle();
  
        if (userRoleError) {
          throw userRoleError;
        }
  
        if (userRoleData?.is_active === false) {
          await supabase.auth.signOut();
  
          setSession(null);
          setCurrentUserRole('Visitor');
          setPage('dashboard');
  
          throw new Error(
            'Your account is inactive. Please contact the administrator.'
          );
        }
  
        /*
         * IMPORTANT:
         * Use the freshly loaded role here,
         * not the previous currentUserRole state.
         */
        await loadData(
          role,
          data.user.id
        );
      }
    } catch (err: any) {
      setLoginError(
        err?.message ||
          'Login failed. Please check your email and password.'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    clearMessages();
    setLoginError('');

    try {
      const { error: oauthError } =
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err: any) {
      setLoginError(
        err?.message ||
          'Google sign-in could not be started.'
      );
    }
  };

  const logout = async () => {
    clearMessages();

    try {
      await supabase.auth.signOut();
      setSession(null);
      setCurrentUserRole('Visitor');
      setPage('dashboard');
    } catch (err: any) {
      setError(
        err?.message ||
          'Unable to sign out.'
      );
    }
  };
  const markShareholderPaymentDone = async (
    row: GenericRow
  ) => {
    clearMessages();
  
    if (!row?.id) {
      setError('Invalid payment record.');
      return;
    }
  
    try {
      const { error: updateError } =
        await supabase
          .from('shareholder_payments')
          .update({
            status: 'done',
          })
          .eq('id', row.id);
  
      if (updateError) {
        throw updateError;
      }
  
      setMessage(
        'Shareholder payment marked as done.'
      );
  
      await loadData(
        currentUserRole,
        currentUserId
      );
    } catch (err: any) {
      setError(
        err?.message ||
          'Unable to update payment status.'
      );
    }
  };

  const saveGenericRow = async (
    table: string,
    data: GenericRow
  ) => {
    clearMessages();
  
    try {
      const {
        data: sessionData,
        error: sessionError,
      } = await supabase.auth.getSession();
  
      if (sessionError) {
        throw sessionError;
      }
  
      const currentSession =
        sessionData.session;
  
      if (!currentSession?.user?.id) {
        setError(
          'No active Supabase session found. Please log in again.'
        );
        return;
      }
  
      const {
        data: authUserData,
        error: authUserError,
      } = await supabase.auth.getUser();
  
      if (authUserError) {
        throw authUserError;
      }
  
      if (!authUserData?.user?.id) {
        setError(
          'Supabase could not verify the logged-in user.'
        );
        return;
      }
  
      if (
        authUserData.user.id !==
        currentSession.user.id
      ) {
        setError(
          'Supabase session user mismatch. Please log in again.'
        );
        return;
      }
  
      const cleanData: GenericRow = {
        ...data,
      };
  
      delete cleanData.id;
      delete cleanData.created_at;
      delete cleanData.updated_at;
      delete cleanData.created;
  
      /*
       * due_amount is a generated column
       * in shareholder_dividends.
       * Supabase must calculate it automatically.
       */
      if (
        table === 'shareholder_dividends'
      ) {
        delete cleanData.due_amount;
      }
  
      /*
       * Company Dividend validation
       */
      if (
        table === 'dividends' &&
        String(cleanData.status ?? '')
          .trim()
          .toLowerCase() === 'declared'
      ) {
        const dividendYear = Number(
          cleanData.dividend_year
        );
  
        const dividendRate = Number(
          cleanData.dividend_rate
        );
  
        if (
          !Number.isInteger(dividendYear) ||
          dividendYear <= 0
        ) {
          setError(
            'Please enter a valid dividend year.'
          );
          return;
        }
  
        if (
          !Number.isFinite(dividendRate) ||
          dividendRate < 0
        ) {
          setError(
            'Dividend rate per share must be zero or greater.'
          );
          return;
        }
      }
  
      /*
       * UPDATE EXISTING RECORD
       */
      if (
        editing?.table === table &&
        editing.row?.id
      ) {
        const { error: updateError } =
          await supabase
            .from(table)
            .update(cleanData)
            .eq(
              'id',
              editing.row.id
            );
  
        if (updateError) {
          throw updateError;
        }
  
        /*
         * If an existing company dividend
         * becomes Declared, generate missing
         * shareholder dividend records.
         */
        if (
          table === 'dividends' &&
          String(cleanData.status ?? '')
            .trim()
            .toLowerCase() === 'declared'
        ) {
          const dividendId =
            Number(editing.row.id);
  
          const dividendRate =
            Number(
              cleanData.dividend_rate
            );
  
          const {
            data: activeShareRows,
            error: shareError,
          } = await supabase
            .from('shareholder_shares')
            .select(
              'shareholder_id, quantity, status'
            )
            .eq(
              'status',
              'active'
            );
  
          if (shareError) {
            throw shareError;
          }
  
          const shareholderTotals: Record<
            string,
            number
          > = {};
  
          (
            activeShareRows ?? []
          ).forEach(
            (share: any) => {
              const shareholderId =
                Number(
                  share.shareholder_id
                );
  
              const quantity =
                Number(
                  share.quantity ?? 0
                );
  
              if (
                Number.isInteger(
                  shareholderId
                ) &&
                shareholderId > 0 &&
                Number.isFinite(
                  quantity
                ) &&
                quantity > 0
              ) {
                const key =
                  String(
                    shareholderId
                  );
  
                shareholderTotals[
                  key
                ] =
                  (
                    shareholderTotals[
                      key
                    ] ?? 0
                  ) + quantity;
              }
            }
          );
  
          for (
            const [
              shareholderIdText,
              shareQuantity,
            ] of Object.entries(
              shareholderTotals
            )
          ) {
            const shareholderId =
              Number(
                shareholderIdText
              );
  
            const dividendAmount =
              shareQuantity *
              dividendRate;
  
            const {
              data: existingRows,
              error: existingError,
            } = await supabase
              .from(
                'shareholder_dividends'
              )
              .select('id')
              .eq(
                'dividend_id',
                dividendId
              )
              .eq(
                'shareholder_id',
                shareholderId
              )
              .limit(1);
  
            if (existingError) {
              throw existingError;
            }
  
            if (
              !existingRows?.length
            ) {
              const {
                error:
                  insertDividendError,
              } = await supabase
                .from(
                  'shareholder_dividends'
                )
                .insert({
                  dividend_id:
                    dividendId,
                  shareholder_id:
                    shareholderId,
                  share_quantity:
                    shareQuantity,
                  dividend_amount:
                    dividendAmount,
                  paid_amount: 0,
                  status: 'pending',
                  notes: null,
                });
  
              if (
                insertDividendError
              ) {
                throw insertDividendError;
              }
            }
          }
        }
  
        setMessage(
          table === 'dividends'
            ? 'Dividend updated successfully.'
            : 'Updated successfully.'
        );
      } else {
        /*
         * INSERT NEW RECORD
         */
        const {
          data: insertedRows,
          error: insertError,
        } = await supabase
          .from(table)
          .insert(cleanData)
          .select()
          .single();
  
        if (insertError) {
          throw insertError;
        }
  
        /*
         * When a new company dividend is Declared,
         * automatically generate shareholder
         * dividend entitlement records.
         */
        if (
          table === 'dividends' &&
          String(
            insertedRows?.status ??
              cleanData.status ??
              ''
          )
            .trim()
            .toLowerCase() ===
            'declared'
        ) {
          const dividendId =
            Number(
              insertedRows?.id
            );
  
          const dividendRate =
            Number(
              insertedRows?.dividend_rate ??
                cleanData.dividend_rate
            );
  
          if (
            !Number.isInteger(
              dividendId
            ) ||
            dividendId <= 0
          ) {
            throw new Error(
              'Dividend was saved, but its ID could not be determined.'
            );
          }
  
          const {
            data: activeShareRows,
            error: shareError,
          } = await supabase
            .from('shareholder_shares')
            .select(
              'shareholder_id, quantity, status'
            )
            .eq(
              'status',
              'active'
            );
  
          if (shareError) {
            throw shareError;
          }
  
          const shareholderTotals: Record<
            string,
            number
          > = {};
  
          (
            activeShareRows ?? []
          ).forEach(
            (share: any) => {
              const shareholderId =
                Number(
                  share.shareholder_id
                );
  
              const quantity =
                Number(
                  share.quantity ?? 0
                );
  
              if (
                Number.isInteger(
                  shareholderId
                ) &&
                shareholderId > 0 &&
                Number.isFinite(
                  quantity
                ) &&
                quantity > 0
              ) {
                const key =
                  String(
                    shareholderId
                  );
  
                shareholderTotals[
                  key
                ] =
                  (
                    shareholderTotals[
                      key
                    ] ?? 0
                  ) + quantity;
              }
            }
          );
  
          const shareholderDividendRows =
            Object.entries(
              shareholderTotals
            ).map(
              ([
                shareholderIdText,
                shareQuantity,
              ]) => {
                const shareholderId =
                  Number(
                    shareholderIdText
                  );
  
                const dividendAmount =
                  shareQuantity *
                  dividendRate;
  
                return {
                  dividend_id:
                    dividendId,
                  shareholder_id:
                    shareholderId,
                  share_quantity:
                    shareQuantity,
                  dividend_amount:
                    dividendAmount,
                  paid_amount: 0,
                  status: 'pending',
                  notes: null,
                };
              }
            );
  
          if (
            shareholderDividendRows.length >
            0
          ) {
            const {
              error:
                shareholderDividendError,
            } = await supabase
              .from(
                'shareholder_dividends'
              )
              .insert(
                shareholderDividendRows
              );
  
            if (
              shareholderDividendError
            ) {
              throw shareholderDividendError;
            }
          }
        }
  
        setMessage(
          table === 'dividends'
            ? 'Dividend declared and shareholder dividend records generated successfully.'
            : 'Saved successfully.'
        );
      }
  
      setEditing(null);
      setGenericForm({});
  
      await loadData(
        currentUserRole,
        currentSession.user.id
      );
    } catch (err: any) {
      console.error(
        'SAVE GENERIC ROW ERROR:',
        err
      );
  
      setError(
        err?.message ||
          'Unable to save this record.'
      );
    }
  };

  const deleteGenericRow = async (
    table: string,
    row: GenericRow
  ) => {
    clearMessages();

    if (!row?.id) {
      setError('This record has no valid ID.');
      return;
    }

    try {
      const { error: deleteError } =
        await supabase
          .from(table)
          .delete()
          .eq('id', row.id);

      if (deleteError) {
        throw deleteError;
      }

      setMessage('Deleted successfully.');

      await loadData(
        currentUserRole,
        currentUserId
      );
    } catch (err: any) {
      setError(
        err?.message ||
          'Unable to delete this record.'
      );
    }
  };

  const startEditRow = (
    table: string,
    row: GenericRow
  ) => {
    clearMessages();
    setEditing({
      table,
      row,
    });
    setGenericForm({
      ...row,
    });
  };

  const cancelGenericEdit = () => {
    setEditing(null);
    setGenericForm({});
  };

  const beginNewGenericRow = (table: string) => {
    clearMessages();
    setEditing({
      table,
      row: {},
    });
    setGenericForm({});
  };

  const resetShareholderForm = () => {
    setShareholderForm({
      ...emptyShareholderForm,
      join_date: todayString(),
    });
    setSelectedShareholder(null);
    setShowShareholderForm(false);
  };

  const resetShareholderShareForm = () => {
    setShareholderShareForm({
      ...emptyShareholderShareForm,
      start_date: todayString(),
    });
    setEditingShareholderShare(null);
    setShowShareholderShareForm(false);
  };

  const openShareholderForEdit = (
    shareholder: GenericRow
  ) => {
    clearMessages();

    setSelectedShareholder(shareholder);

    setShareholderForm({
      company_shareholder_id:
        shareholder.company_shareholder_id != null
          ? String(
              shareholder.company_shareholder_id
            )
          : '',

      user_id:
        shareholder.user_id != null
          ? String(shareholder.user_id)
          : '',

      full_name:
        shareholder.full_name ?? '',

      email:
        shareholder.email ?? '',

      phone_number:
        shareholder.phone_number ?? '',

      national_id:
        shareholder.national_id ?? '',

      profession:
        shareholder.profession ?? '',

      address:
        shareholder.address ?? '',

      share_quantity:
        shareholder.share_quantity != null
          ? String(shareholder.share_quantity)
          : '',

      share_type:
        shareholder.share_type != null
          ? String(shareholder.share_type)
          : '',

      share_price:
        shareholder.share_price != null
          ? String(shareholder.share_price)
          : '',

      deposit_amount:
        shareholder.deposit_amount != null
          ? String(shareholder.deposit_amount)
          : '',

      join_date:
        shareholder.join_date ??
        todayString(),

      note:
        shareholder.note ?? '',
    });

    setShowShareholderForm(true);
  };

  const openShareholderForView = (
    shareholder: GenericRow
  ) => {
    setSelectedShareholder(shareholder);
    setShareholderForm({
      company_shareholder_id:
        shareholder.company_shareholder_id != null
          ? String(
              shareholder.company_shareholder_id
            )
          : '',

      user_id:
        shareholder.user_id != null
          ? String(shareholder.user_id)
          : '',

      full_name:
        shareholder.full_name ?? '',

      email:
        shareholder.email ?? '',

      phone_number:
        shareholder.phone_number ?? '',

      national_id:
        shareholder.national_id ?? '',

      profession:
        shareholder.profession ?? '',

      address:
        shareholder.address ?? '',

      share_quantity:
        shareholder.share_quantity != null
          ? String(shareholder.share_quantity)
          : '',

      share_type:
        shareholder.share_type != null
          ? String(shareholder.share_type)
          : '',

      share_price:
        shareholder.share_price != null
          ? String(shareholder.share_price)
          : '',

      deposit_amount:
        shareholder.deposit_amount != null
          ? String(shareholder.deposit_amount)
          : '',

      join_date:
        shareholder.join_date ??
        '',

      note:
        shareholder.note ?? '',
    });

    setShowShareholderForm(true);
  };

  const openNewShareholder = () => {
    clearMessages();
    setSelectedShareholder(null);
    setShareholderForm({
      ...emptyShareholderForm,
      join_date: todayString(),
    });
    setShowShareholderForm(true);
  };

  const openNewShareholderShare = () => {
    clearMessages();

    setEditingShareholderShare(null);

    setShareholderShareForm({
      ...emptyShareholderShareForm,
      start_date: todayString(),
    });

    setShowShareholderShareForm(true);
  };

  const openShareholderShareForEdit = (
    row: GenericRow
  ) => {
    clearMessages();

    setEditingShareholderShare(row);

    setShareholderShareForm({
      shareholder_id:
        row.shareholder_id != null
          ? String(row.shareholder_id)
          : '',

      share_type_id:
        row.share_type_id != null
          ? String(row.share_type_id)
          : '',

      company_share_id:
        row.company_share_id != null
          ? String(row.company_share_id)
          : '',

      quantity:
        row.quantity != null
          ? String(row.quantity)
          : '',

      share_price:
        row.share_price != null
          ? String(row.share_price)
          : '',

      start_date:
        row.start_date ?? '',

      end_date:
        row.end_date ?? '',

      status:
        row.status ?? 'active',

      notes:
        row.notes ?? '',
    });

    setShowShareholderShareForm(true);
  };
  const createShareholderAccount = async () => {
    const fullName =
      shareholderForm.full_name?.trim();
  
    const email =
      shareholderForm.email?.trim().toLowerCase();
  
    const existingUserId =
      shareholderForm.user_id?.trim();
  
    if (!fullName) {
      setError(
        'Shareholder full name is required.'
      );
      return;
    }
  
    if (!email) {
      setError(
        'Shareholder Gmail is required.'
      );
      return;
    }
  
    setCreatingShareholderAccount(true);
    setError('');
    setMessage('');
  
    try {
      const {
        data: {
          session: currentSession,
        },
        error: sessionError,
      } = await supabase.auth.getSession();
  
      if (sessionError) {
        throw new Error(
          `Session error: ${sessionError.message}`
        );
      }
  
      if (!currentSession?.access_token) {
        throw new Error(
          'Your login session has expired. Please log in again.'
        );
      }
  
      /*
       * If User ID already exists,
       * update the existing login email.
       *
       * This does NOT create a new user.
       */
      if (existingUserId) {
        const response =
          await supabase.functions.invoke(
            'create-shareholder-account',
            {
              headers: {
                Authorization: `Bearer ${currentSession.access_token}`,
              },
              body: {
                action: 'update_email',
                user_id: existingUserId,
                email: email,
              },
            }
          );
  
        console.log(
          'UPDATE SHAREHOLDER EMAIL RESPONSE:',
          response
        );
  
        if (response.error) {
          let actualError =
            response.error.message ||
            'Unable to update shareholder login email.';
  
          try {
            const context =
              (response.error as any)?.context;
  
            if (
              context &&
              typeof context.json ===
                'function'
            ) {
              const errorBody =
                await context.json();
  
              if (errorBody?.error) {
                actualError =
                  String(errorBody.error);
              }
            }
          } catch {
            // Keep original error message.
          }
  
          throw new Error(actualError);
        }
  
        if (!response.data?.user_id) {
          throw new Error(
            'User ID was not returned after email update.'
          );
        }
  
        setShareholderForm((old) => ({
          ...old,
          user_id: response.data.user_id,
          email: response.data.email ?? email,
        }));
  
        setShareholderAccountCreated(true);
  
        setMessage(
          'Shareholder login email updated successfully. The same Supabase User ID has been kept.'
        );
  
        return;
      }
  
      /*
       * No User ID yet:
       * create a brand-new Shareholder login account.
       */
      const response =
        await supabase.functions.invoke(
          'create-shareholder-account',
          {
            headers: {
              Authorization: `Bearer ${currentSession.access_token}`,
            },
            body: {
              action: 'create',
              full_name: fullName,
              email: email,
            },
          }
        );
  
      console.log(
        'CREATE SHAREHOLDER ACCOUNT RESPONSE:',
        response
      );
  
      if (response.error) {
        let actualError =
          response.error.message ||
          'Unable to create shareholder account.';
  
        try {
          const context =
            (response.error as any)?.context;
  
          if (
            context &&
            typeof context.json ===
              'function'
          ) {
            const errorBody =
              await context.json();
  
            if (errorBody?.error) {
              actualError =
                String(errorBody.error);
            }
          }
        } catch {
          // Keep original error message.
        }
  
        throw new Error(actualError);
      }
  
      const data = response.data;
  
      if (!data?.user_id) {
        throw new Error(
          'Supabase User ID was not returned.'
        );
      }
  
      setShareholderForm((old) => ({
        ...old,
        user_id: data.user_id,
        email: email,
      }));
  
      setShareholderAccountCreated(true);
  
      setMessage(
        'Shareholder login account created successfully. Invitation email has been sent.'
      );
    } catch (err: any) {
      console.error(
        'SHAREHOLDER ACCOUNT ERROR:',
        err
      );
  
      setError(
        err?.message ||
          'Unable to manage shareholder login account.'
      );
    } finally {
      setCreatingShareholderAccount(false);
    }
  };
  const saveShareholder = async () => {
    clearMessages();
  
    if (!session?.user?.id) {
      setError('Please log in first.');
      return;
    }
  
    const businessId =
      shareholderForm.company_shareholder_id
        ? Number(
            shareholderForm.company_shareholder_id
          )
        : null;
  
    if (
      businessId !== null &&
      (!Number.isInteger(businessId) ||
        businessId <= 0)
    ) {
      setError(
        'Company Shareholder ID must be a positive whole number.'
      );
      return;
    }
  
    const quantity = Number(
      shareholderForm.share_quantity || 0
    );
  
    const sharePrice = Number(
      shareholderForm.share_price || 0
    );
  
    const depositAmount = Number(
      shareholderForm.deposit_amount || 0
    );
  
    if (
      !Number.isFinite(quantity) ||
      quantity < 0 ||
      !Number.isFinite(sharePrice) ||
      sharePrice < 0 ||
      !Number.isFinite(depositAmount) ||
      depositAmount < 0
    ) {
      setError(
        'Share quantity, share price and deposit amount cannot be negative.'
      );
      return;
    }
  
    if (!shareholderForm.full_name.trim()) {
      setError('Full name is required.');
      return;
    }
  
    /*
     * IMPORTANT:
     *
     * Share quantity and total share value shown
     * on the Shareholders page are now calculated
     * from shareholder_shares.
     *
     * Therefore the values below are kept only as
     * legacy/registration information and are NOT
     * used as the actual ownership source.
     */
    const totalShareValue =
      quantity * sharePrice;
  
    const dueAmount = Math.max(
      totalShareValue - depositAmount,
      0
    );
  
    const totalCompanyShares = Number(
      shareConfig?.total_share ?? 10000
    );
  
    const percentage =
      totalCompanyShares > 0
        ? (quantity / totalCompanyShares) * 100
        : 0;
  
    /*
     * Share Type is kept as shareholder information.
     *
     * Actual share type for an individual Company Share
     * is stored in shareholder_shares.share_type_id
     * when the share is actually assigned.
     */
    const shareTypeText =
      shareholderForm.share_type
        .trim()
        .toLowerCase();
  
    let shareTypeId: number | null = null;
  
    if (
      shareTypeText === 'permanent' ||
      shareTypeText === 'স্থায়ী শেয়ার' ||
      shareTypeText === 'স্থায়ী শেয়ার' ||
      shareTypeText === 'স্থায়ী' ||
      shareTypeText === 'স্থায়ী'
    ) {
      shareTypeId = 3;
    } else if (
      shareTypeText === 'temporary' ||
      shareTypeText === 'অস্থায়ী শেয়ার' ||
      shareTypeText === 'অস্থায়ী শেয়ার' ||
      shareTypeText === 'অস্থায়ী' ||
      shareTypeText === 'অস্থায়ী'
    ) {
      shareTypeId = 2;
    } else if (
      shareTypeText === 'general' ||
      shareTypeText === 'সাধারণ শেয়ার' ||
      shareTypeText === 'সাধারণ শেয়ার'
    ) {
      shareTypeId = 1;
    }
  
    try {
      /*
       * ==========================================
       * UPDATE EXISTING SHAREHOLDER
       * ==========================================
       *
       * IMPORTANT:
       * Do NOT update shareholder_shares here.
       *
       * Editing this form changes the shareholder's
       * personal/registration information only.
       *
       * Actual Company Share ownership is managed
       * from the Shareholder Shares page.
       */
      if (selectedShareholder?.id) {
        const payload: GenericRow = {
          company_shareholder_id: businessId,
  
          user_id:
            shareholderForm.user_id.trim() ||
            null,
  
          full_name:
            shareholderForm.full_name.trim(),
  
          email:
            shareholderForm.email.trim() ||
            null,
  
          phone_number:
            shareholderForm.phone_number.trim() ||
            null,
  
          national_id:
            shareholderForm.national_id.trim() ||
            null,
  
          profession:
            shareholderForm.profession.trim() ||
            null,
  
          address:
            shareholderForm.address.trim() ||
            null,
  
          /*
           * These legacy summary fields are intentionally
           * NOT changed during shareholder editing.
           *
           * The actual values shown in the UI come from
           * shareholder_shares.
           */
  
          share_type:
            shareholderForm.share_type.trim() ||
            null,
  
          share_price: sharePrice,
  
          deposit_amount:
            depositAmount,
  
          join_date:
            shareholderForm.join_date || null,
  
          note:
            shareholderForm.note.trim() || null,
        };
  
        const { error: updateError } =
          await supabase
            .from('shareholders')
            .update(payload)
            .eq(
              'id',
              selectedShareholder.id
            );
  
        if (updateError) {
          throw updateError;
        }
  
        setMessage(
          'Shareholder information updated successfully.'
        );
      } else {
        /*
         * ==========================================
         * CREATE NEW SHAREHOLDER
         * ==========================================
         *
         * Only the shareholder profile is created here.
         *
         * Company Share IDs are NOT automatically
         * inserted into shareholder_shares.
         *
         * After registration, actual Company Share IDs
         * should be added from:
         *
         * Shareholder Shares → Add Share
         */
        const payload: GenericRow = {
          company_shareholder_id: businessId,
  
          user_id:
            shareholderForm.user_id.trim() ||
            null,
  
          full_name:
            shareholderForm.full_name.trim(),
  
          email:
            shareholderForm.email.trim() ||
            null,
  
          phone_number:
            shareholderForm.phone_number.trim() ||
            null,
  
          national_id:
            shareholderForm.national_id.trim() ||
            null,
  
          profession:
            shareholderForm.profession.trim() ||
            null,
  
          address:
            shareholderForm.address.trim() ||
            null,
  
          /*
           * Keep the entered registration information,
           * but these are NOT the source of truth for
           * actual ownership.
           */
          share_quantity: quantity,
  
          share_type:
            shareholderForm.share_type.trim() ||
            null,
  
          share_price: sharePrice,
  
          total_share_value:
            totalShareValue,
  
          deposit_amount:
            depositAmount,
  
          due_amount:
            dueAmount,
  
          percentage,
  
          join_date:
            shareholderForm.join_date || null,
  
          note:
            shareholderForm.note.trim() || null,
        };
  
        const {
          data: newShareholder,
          error: insertError,
        } = await supabase
          .from('shareholders')
          .insert(payload)
          .select()
          .single();
  
        if (insertError) {
          throw insertError;
        }
  
        if (!newShareholder?.id) {
          throw new Error(
            'Shareholder was created, but its database ID could not be found.'
          );
        }
  
        /*
         * NO shareholder_shares INSERT HERE.
         *
         * Actual Company Share IDs will be assigned
         * later from the Shareholder Shares page.
         */
  
        setMessage(
          'Shareholder added successfully. Please assign the actual Company Share ID(s) from Shareholder Shares.'
        );
      }
  
      resetShareholderForm();
  
      setShareholderAccountCreated(false);
  
      await loadData(
        currentUserRole,
        session.user.id
      );
    } catch (err: any) {
      console.error(
        'SAVE SHAREHOLDER ERROR:',
        err
      );
  
      setError(
        err?.message ||
          'Unable to save shareholder.'
      );
    }
  };
  
  const saveShareholderShare = async () => {
    clearMessages();
  
    if (!session?.user?.id) {
      setError('Please log in first.');
      return;
    }
  
    const shareholderId = Number(
      shareholderShareForm.shareholder_id
    );
  
    const shareTypeId = Number(
      shareholderShareForm.share_type_id
    );
  
    const sharePrice = Number(
      shareholderShareForm.share_price
    );
  
    const companyShareIds = String(
      shareholderShareForm.company_share_id || ''
    )
      .split(/[\s,]+/)
      .map((value) => Number(value.trim()))
      .filter(
        (value) =>
          Number.isInteger(value) && value > 0
      );
  
    const uniqueCompanyShareIds = [
      ...new Set(companyShareIds),
    ];
  
    const quantity =
      uniqueCompanyShareIds.length;
  
    if (
      !Number.isInteger(shareholderId) ||
      shareholderId <= 0
    ) {
      setError('Please select a shareholder.');
      return;
    }
  
    const selectedShareholderForShare =
      shareholders.find(
        (item) =>
          Number(item.id) === shareholderId
      );
  
    if (!selectedShareholderForShare) {
      setError(
        'Selected shareholder was not found.'
      );
      return;
    }
  
    if (
      !Number.isInteger(shareTypeId) ||
      ![1, 2, 3].includes(shareTypeId)
    ) {
      setError(
        'Please select a valid share type.'
      );
      return;
    }
  
    if (uniqueCompanyShareIds.length === 0) {
      setError(
        'Please enter at least one valid Company Share ID.'
      );
      return;
    }
  
    if (
      uniqueCompanyShareIds.length !==
      companyShareIds.length
    ) {
      setError(
        'Duplicate Company Share ID found. Please enter each ID only once.'
      );
      return;
    }
  
    if (
      !Number.isFinite(sharePrice) ||
      sharePrice <= 0
    ) {
      setError(
        'Share price must be greater than zero.'
      );
      return;
    }
  
    try {
      if (editingShareholderShare?.id) {
        const companyShareId =
          uniqueCompanyShareIds[0];
  
        const payload: GenericRow = {
          shareholder_id: shareholderId,
          share_type_id: shareTypeId,
          company_share_id: companyShareId,
          quantity: 1,
          share_price: sharePrice,
          start_date:
            shareholderShareForm.start_date ||
            null,
          end_date:
            shareholderShareForm.end_date ||
            null,
          status:
            shareholderShareForm.status ||
            'active',
          notes:
            shareholderShareForm.notes?.trim() ||
            null,
        };
  
        const { error: updateError } =
          await supabase
            .from('shareholder_shares')
            .update(payload)
            .eq(
              'id',
              editingShareholderShare.id
            );
  
        if (updateError) {
          throw updateError;
        }
  
        setMessage(
          'Shareholder share updated successfully.'
        );
      } else {
        const payload =
          uniqueCompanyShareIds.map(
            (companyShareId) => ({
              shareholder_id: shareholderId,
              share_type_id: shareTypeId,
              company_share_id:
                companyShareId,
              quantity: 1,
              share_price: sharePrice,
              start_date:
                shareholderShareForm.start_date ||
                null,
              end_date:
                shareholderShareForm.end_date ||
                null,
              status:
                shareholderShareForm.status ||
                'active',
              notes:
                shareholderShareForm.notes?.trim() ||
                null,
            })
          );
  
        const { error: insertError } =
          await supabase
            .from('shareholder_shares')
            .insert(payload);
  
        if (insertError) {
          throw insertError;
        }
  
        setMessage(
          `${quantity} shareholder share${
            quantity > 1 ? 's' : ''
          } added successfully.`
        );
      }
  
      await loadData(
        currentUserRole,
        currentUserId
      );

      resetShareholderShareForm();
    } catch (err: any) {
      console.error(
        'SAVE SHAREHOLDER SHARE ERROR:',
        err
      );
  
      setError(
        err?.message ||
          'Unable to save shareholder share.'
      );
    }
  };

  const deleteShareholderShare = async (
    row: GenericRow
  ) => {
    clearMessages();
  
    const rowId = Number(row?.id);
  
    if (!Number.isInteger(rowId) || rowId <= 0) {
      setError('Invalid shareholder share ID.');
      return;
    }
  
    try {
      const { data: deletedRows, error: deleteError } =
        await supabase
          .from('shareholder_shares')
          .delete()
          .eq('id', rowId)
          .select('id');
  
      if (deleteError) {
        console.error(
          'DELETE SHAREHOLDER SHARE ERROR:',
          deleteError
        );
  
        throw deleteError;
      }
  
      console.log(
        'DELETED SHAREHOLDER SHARE:',
        deletedRows
      );
  
      /*
       * If no row was actually deleted, do not show
       * "deleted successfully".
       *
       * This usually means RLS/policy is preventing
       * the delete operation.
       */
      if (!deletedRows || deletedRows.length === 0) {
        setError(
          'The share was not deleted. Supabase did not delete any record. Please check the DELETE permission/RLS policy for shareholder_shares.'
        );
        return;
      }
  
      /*
       * Remove it immediately from the current screen.
       */
      setShareholderShares((old) =>
        old.filter(
          (item) =>
            Number(item.id) !== rowId
        )
      );
  
      if (
        editingShareholderShare?.id === rowId
      ) {
        resetShareholderShareForm();
      }
  
      setMessage(
        'Shareholder share deleted successfully.'
      );
  
      /*
       * Reload the latest data from Supabase.
       */
      await loadData(
        currentUserRole,
        currentUserId
      );
    } catch (err: any) {
      console.error(
        'DELETE SHAREHOLDER SHARE FAILED:',
        err
      );
  
      setError(
        err?.message ||
          err?.details ||
          err?.hint ||
          'Unable to delete shareholder share.'
      );
    }
  };

  const saveCompanyShareConfiguration =
    async () => {
      clearMessages();

      if (!session?.user?.id) {
        setError('Please log in first.');
        return;
      }

      const totalShare = Number(
        genericForm.total_share || 0
      );

      const sharePrice = Number(
        genericForm.share_price || 0
      );

      if (
        !Number.isInteger(totalShare) ||
        totalShare <= 0
      ) {
        setError(
          'Total share must be greater than zero.'
        );
        return;
      }

      if (
        !Number.isFinite(sharePrice) ||
        sharePrice <= 0
      ) {
        setError(
          'Share price must be greater than zero.'
        );
        return;
      }

      const payload = {
        total_share: totalShare,
        share_price: sharePrice,
        currency:
          genericForm.currency || 'BDT',
      };

      try {
        if (editing?.row?.id) {
          const { error: updateError } =
            await supabase
              .from(
                'company_share_configuration'
              )
              .update(payload)
              .eq('id', editing.row.id);

          if (updateError) {
            throw updateError;
          }

          setMessage(
            'Company share configuration updated.'
          );
        } else {
          const { error: insertError } =
            await supabase
              .from(
                'company_share_configuration'
              )
              .insert(payload);

          if (insertError) {
            throw insertError;
          }

          setMessage(
            'Company share configuration saved.'
          );
        }

        setEditing(null);
        setGenericForm({});

        await loadData(
          currentUserRole,
          session.user.id
        );
      } catch (err: any) {
        setError(
          err?.message ||
            'Unable to save company share configuration.'
        );
      }
    };

  const addTransferItem = () => {
    setShareRequestItems((items) => [
      ...items,
      {
        share_id: '',
        shareholder_share_id: '',
        quantity: '',
        purchase_value: '',
      },
    ]);
  };

  const removeTransferItem = (
    index: number
  ) => {
    setShareRequestItems((items) => {
      if (items.length <= 1) {
        return [
          {
            share_id: '',
            shareholder_share_id: '',
            quantity: '',
            purchase_value: '',
          },
        ];
      }

      return items.filter(
        (_, itemIndex) => itemIndex !== index
      );
    });
  };

  const updateTransferItem = (
    index: number,
    field: keyof TransferItem,
    value: string
  ) => {
    setShareRequestItems((items) =>
      items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const getApplicantShareholder = () => {
    if (
      currentUserRole === 'Shareholder' &&
      currentShareholder
    ) {
      return currentShareholder;
    }
  
    if (shareTransferApplicant) {
      return (
        shareholders.find(
          (item) =>
            String(item.company_shareholder_id) ===
            String(shareTransferApplicant)
        ) ?? null
      );
    }
  
    if (shareTransferFrom) {
      return (
        shareholders.find(
          (item) =>
            String(item.company_shareholder_id) ===
            String(shareTransferFrom)
        ) ?? null
      );
    }
  
    return null;
  };
  
  const getApplicantShares = () => {
    const applicant = getApplicantShareholder();
  
    if (!applicant?.id) {
      return [];
    }
  
    return shareholderShares.filter(
      (share) =>
        String(share.shareholder_id) ===
          String(applicant.id) &&
        String(
          share.status ?? 'active'
        ).toLowerCase() === 'active'
    );
  };
  
  const getTransferRowAvailableShares = (
    rowIndex: number
  ) => {
    const selectedElsewhere = new Set(
      shareRequestItems
        .filter((_, index) => index !== rowIndex)
        .map((item) => String(item.share_id))
        .filter(Boolean)
    );
  
    return getApplicantShares().filter(
      (share) =>
        !selectedElsewhere.has(
          String(share.company_share_id)
        ) ||
        String(share.company_share_id) ===
          String(
            shareRequestItems[rowIndex]?.share_id ?? ''
          )
    );
  };

  const getSelectedTransferQuantity = () => {
    return shareRequestItems.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0),
      0
    );
  };

  const resetTransferForm = () => {
    setShareTransferRequestType(
      'Share Transfer'
    );

    setShareTransferApplicant('');
    setShareTransferFrom('');
    setShareTransferTo('');
    setShareTransferQuantity('');
    setShareTransferDate(todayString());
    setShareTransferNote('');

    setWithdrawalBeneficiaryName('');
    setWithdrawalBeneficiaryAccount('');
    setWithdrawalPaymentMethod(
      'Bank Transfer'
    );
    setWithdrawalSharePrice('');
    setWithdrawalAvailableQuantity('');

    setShareRequestItems([
      {
        share_id: '',
        shareholder_share_id: '',
        quantity: '',
        purchase_value: '',
      },
    ]);
  };

  const submitShareTransferRequest =
  async () => {
    clearMessages();

    if (!session?.user?.id) {
      setError('Please log in first.');
      return;
    }

    const applicant =
      getApplicantShareholder();

    if (!applicant?.id) {
      setError(
        'Please select an applicant shareholder.'
      );
      return;
    }

    if (
      currentUserRole === 'Shareholder' &&
      String(applicant.user_id ?? '') !==
        String(session.user.id)
    ) {
      setError(
        'You can submit requests only for your own shareholder account.'
      );
      return;
    }

    const sourceShares =
      getApplicantShares();

    if (!sourceShares.length) {
      setError(
        'No active shareholder shares were found.'
      );
      return;
    }

    const requestType =
      shareTransferRequestType;

    if (
      requestType === 'Share Transfer' &&
      !shareTransferTo
    ) {
      setError(
        'Please select the receiving shareholder.'
      );
      return;
    }

    if (
      requestType === 'Share Transfer' &&
      String(shareTransferTo) ===
        String(applicant.id)
    ) {
      setError(
        'The receiving shareholder must be different from the applicant.'
      );
      return;
    }

    const selectedItems =
      shareRequestItems.filter(
        (item) =>
          item.share_id &&
          Number(item.quantity || 0) > 0
      );

    if (
      requestType === 'Share Transfer' &&
      selectedItems.length === 0
    ) {
      setError(
        'Please select at least one share.'
      );
      return;
    }

    let requestItemsPayload: any[] = [];

    /*
     * SHARE TRANSFER
     * --------------
     * Always re-read the actual shareholder_shares
     * rows from the database.
     *
     * The employee/user cannot decide the value.
     */
    if (selectedItems.length > 0) {
      const selectedIds = [
        ...new Set(
          selectedItems.map((item) =>
            Number(item.share_id)
          )
        ),
      ];

      if (
        selectedIds.some(
          (id) =>
            !Number.isInteger(id) || id <= 0
        )
      ) {
        setError(
          'Invalid company share ID.'
        );
        return;
      }

      const {
        data: verifiedShares,
        error: verifyError,
      } = await supabase
        .from('shareholder_shares')
        .select('*')
        .eq(
          'shareholder_id',
          applicant.id
        )
        .eq('status', 'active')
        .in(
          'company_share_id',
          selectedIds
        );

      if (verifyError) {
        throw verifyError;
      }

      if (
        (verifiedShares ?? []).length !==
        selectedIds.length
      ) {
        setError(
          'One or more selected company shares do not belong to the applicant or are not active.'
        );
        return;
      }

      const usedIds =
        new Set<string>();

      for (const item of selectedItems) {
        const companyShareId =
          String(item.share_id);

        if (
          usedIds.has(companyShareId)
        ) {
          setError(
            'The same company share cannot be selected twice.'
          );
          return;
        }

        usedIds.add(companyShareId);

        const sourceShare =
          (verifiedShares ?? []).find(
            (share) =>
              String(
                share.company_share_id
              ) === companyShareId
          );

        if (!sourceShare) {
          setError(
            `Share ${companyShareId} was not found for this shareholder.`
          );
          return;
        }

        const requestedQuantity =
          Number(item.quantity);

        const availableQuantity =
          Number(
            sourceShare.quantity ?? 0
          );

        if (
          !Number.isInteger(
            requestedQuantity
          ) ||
          requestedQuantity <= 0
        ) {
          setError(
            `Invalid quantity for company share ${companyShareId}.`
          );
          return;
        }

        if (
          requestedQuantity >
          availableQuantity
        ) {
          setError(
            `Requested quantity for share ${companyShareId} exceeds available quantity.`
          );
          return;
        }

        const sharePrice =
          Number(
            sourceShare.share_price ?? 0
          );

        if (
          !Number.isFinite(
            sharePrice
          ) ||
          sharePrice <= 0
        ) {
          setError(
            `No valid share value was found for company share ${companyShareId}.`
          );
          return;
        }

        /*
         * IMPORTANT:
         * These values come from the database,
         * NOT from the form.
         */
        requestItemsPayload.push({
          share_id:
            Number(
              sourceShare.company_share_id
            ),

          shareholder_share_id:
            Number(sourceShare.id),

          quantity:
            requestedQuantity,

          share_price:
            sharePrice,

          purchase_value:
            requestedQuantity *
            sharePrice,

          original_status:
            sourceShare.status ??
            'active',
        });
      }
    }

    const totalQuantity =
      requestItemsPayload.reduce(
        (sum, item) =>
          sum +
          Number(
            item.quantity || 0
          ),
        0
      );

    let quantity =
      totalQuantity;

    /*
     * WITHDRAWAL / CLOSURE
     */
    if (
      requestType ===
        'Share Withdrawal' ||
      requestType ===
        'Share Closure'
    ) {
      quantity =
        Number(
          shareTransferQuantity || 0
        ) || totalQuantity;

      if (
        !Number.isInteger(
          quantity
        ) ||
        quantity <= 0
      ) {
        setError(
          'Please enter a valid quantity.'
        );
        return;
      }
    }

    /*
     * WITHDRAWAL
     */
    if (
      requestType ===
      'Share Withdrawal'
    ) {
      const available =
        Number(
          withdrawalAvailableQuantity ||
            0
        ) ||
        sourceShares.reduce(
          (sum, item) =>
            sum +
            Number(
              item.quantity || 0
            ),
          0
        );

      if (
        quantity > available
      ) {
        setError(
          'Withdrawal quantity exceeds available shares.'
        );
        return;
      }

      const price =
        Number(
          withdrawalSharePrice || 0
        ) ||
        Number(
          shareConfig?.share_price ||
            0
        );

      if (price <= 0) {
        setError(
          'Please enter a valid withdrawal share price.'
        );
        return;
      }

      const withdrawalShares = sourceShares
  .flatMap((item) => {
    const itemQuantity = Number(item.quantity || 0);

    return Array.from(
      { length: itemQuantity },
      (_, index) => ({
        shareholder_share_id:
          item.id,
        company_share_id:
          item.company_share_id,
      })
    );
  })
  .slice(0, quantity);

requestItemsPayload.push({
  withdrawal: true,
  quantity,
  share_price: price,
  total_value:
    quantity * price,
  beneficiary_name:
    withdrawalBeneficiaryName.trim(),
  beneficiary_account:
    withdrawalBeneficiaryAccount.trim(),
  payment_method:
    withdrawalPaymentMethod,
  shares: withdrawalShares,
});
    }

    /*
     * CLOSURE
     */
    if (
      requestType ===
      'Share Closure'
    ) {
      const activeQuantity =
        sourceShares.reduce(
          (sum, item) =>
            sum +
            Number(
              item.quantity || 0
            ),
          0
        );

        if (
          quantity !== activeQuantity
        ) {
          setError(
            `Closure quantity must be equal to all active shares (${activeQuantity}).`
          );
          return;
        }

      const closurePrice =
        Number(
          withdrawalSharePrice || 0
        ) ||
        Number(
          shareConfig?.share_price ||
            0
        );

        const closureShares = sourceShares.flatMap(
          (item) => {
            const itemQuantity = Number(
              item.quantity || 0
            );
        
            return Array.from(
              { length: itemQuantity },
              () => ({
                shareholder_share_id:
                  item.id,
                company_share_id:
                  item.company_share_id,
              })
            );
          }
        );
        
        requestItemsPayload.push({
          closure: true,
          quantity,
          share_price:
            closurePrice,
          total_value:
            quantity *
            closurePrice,
          shares: closureShares,
        });
    }

    /*
     * For transfer, calculate total directly
     * from the verified database snapshot.
     */
    const transferTotalValue =
      requestItemsPayload.reduce(
        (sum, item) => {
          if (
            item.withdrawal ||
            item.closure
          ) {
            return sum;
          }

          return (
            sum +
            Number(
              item.purchase_value ||
                0
            )
          );
        },
        0
      );

    const selectedShareholderShareId =
      requestItemsPayload.find(
        (item) =>
          item.shareholder_share_id
      )?.shareholder_share_id ??
      null;

    const sharePrice =
      requestType ===
      'Share Transfer'
        ? (
            requestItemsPayload.length ===
            1
              ? Number(
                  requestItemsPayload[0]
                    ?.share_price || 0
                )
              : null
          )
        : Number(
            withdrawalSharePrice || 0
          ) ||
          Number(
            shareConfig?.share_price ||
              0
          ) ||
          null;

    const totalAmount =
      requestType ===
      'Share Transfer'
        ? transferTotalValue
        : quantity > 0 &&
          sharePrice
        ? quantity * sharePrice
        : null;

    /*
     * Save the complete immutable request snapshot.
     *
     * This is what Employee, Accountant and Admin
     * will all review.
     */
    const requestItems = {
      items:
        requestItemsPayload,

      note:
        shareTransferNote.trim(),

      beneficiary_name:
        withdrawalBeneficiaryName.trim(),

      beneficiary_account:
        withdrawalBeneficiaryAccount.trim(),

      payment_method:
        withdrawalPaymentMethod,

      verification: {
        source:
          'shareholder_shares',
        value_verified:
          requestType ===
          'Share Transfer',
        verified_at:
          new Date().toISOString(),
      },
    };

    const payload: GenericRow = {
      from_shareholder_id:
        applicant.id,

      to_shareholder_id:
        requestType ===
        'Share Transfer'
          ? Number(
              shareTransferTo
            )
          : null,

      applicant_shareholder_id:
        applicant.id,

      shareholder_share_id:
        selectedShareholderShareId,

      quantity,

      transfer_date:
        shareTransferDate ||
        todayString(),

      request_type:
        requestType,

      /*
       * New request starts here.
       * Employee must re-check it before
       * Accountant can verify it.
       */
      status:
        'pending',

      submitted_by:
        session.user.id,

      request_items:
        requestItems,

      share_price:
        sharePrice,

      total_amount:
        totalAmount,

      financial_direction:
        requestType ===
        'Share Transfer'
          ? 'none'
          : 'pay',

      payment_account:
        withdrawalBeneficiaryName.trim() ||
        null,

      payment_account_number:
        withdrawalBeneficiaryAccount.trim() ||
        null,

      transaction_reference:
        null,

      accountant_remarks:
        null,
    };

    try {
      const {
        error: insertError,
      } = await supabase
        .from('share_transfers')
        .insert(payload);

      if (insertError) {
        throw insertError;
      }

      setMessage(
        `${requestType} request submitted successfully. Please re-check the request before forwarding.`
      );

      resetTransferForm();

      await loadData(
        currentUserRole,
        session.user.id
      );
    } catch (err: any) {
      console.error(
        'SUBMIT SHARE TRANSFER REQUEST ERROR:',
        err
      );

      setError(
        err?.message ||
          'Unable to submit share request.'
      );
    }
  };
  const updateTransferStatus = async (
    transfer: GenericRow,
    status:
      | 'employee_rechecked'
      | 'accountant_verified'
      | 'approved'
      | 'rejected'
  ) => {
    clearMessages();
  
    if (!transfer?.id) {
      setError('Invalid transfer request.');
      return;
    }
  
    const requestType = String(
      transfer.request_type ?? 'Share Transfer'
    )
      .trim()
      .toLowerCase();
  
    const isShareTransfer =
      requestType === 'share transfer';
  
    const isShareWithdrawal =
      requestType === 'share withdrawal';
  
    const isShareClosure =
      requestType === 'share closure';
  
    const currentTransferStatus = String(
      transfer.status ?? ''
    )
      .trim()
      .toLowerCase();
  
    const verification =
      transfer.request_items?.verification ?? {};
  
    const items = Array.isArray(
      transfer.request_items?.items
    )
      ? transfer.request_items.items
      : [];
  
    /*
     * =====================================================
     * EMPLOYEE RE-CHECK & FORWARD
     * =====================================================
     */
    if (status === 'employee_rechecked') {
      if (currentUserRole !== 'Employee') {
        setError(
          'Only an Employee can re-check and forward this request.'
        );
        return;
      }
  
      if (currentTransferStatus !== 'pending') {
        setError(
          'This request is no longer waiting for Employee re-check.'
        );
        return;
      }
  
      if (
        isShareTransfer &&
        items.length === 0
      ) {
        setError(
          'No share details were found in this request.'
        );
        return;
      }
  
      if (
        (isShareWithdrawal ||
          isShareClosure) &&
        items.length === 0
      ) {
        setError(
          'No withdrawal or closure details were found in this request.'
        );
        return;
      }
  
      try {
        /*
         * SHARE TRANSFER
         *
         * Every selected Company Share must still
         * exist, belong to the applicant, remain active,
         * and retain the same value.
         */
        if (isShareTransfer) {
          for (const item of items) {
            if (
              !item?.shareholder_share_id ||
              !item?.share_id
            ) {
              setError(
                'A share record is missing from this request.'
              );
              return;
            }
  
            const {
              data: currentShare,
              error: shareError,
            } = await supabase
              .from('shareholder_shares')
              .select('*')
              .eq(
                'id',
                Number(
                  item.shareholder_share_id
                )
              )
              .maybeSingle();
  
            if (shareError) {
              throw shareError;
            }
  
            if (!currentShare) {
              setError(
                `Share record ${item.shareholder_share_id} could not be found.`
              );
              return;
            }
  
            if (
              Number(
                currentShare.company_share_id
              ) !== Number(item.share_id)
            ) {
              setError(
                `Company Share ID mismatch for share record ${item.shareholder_share_id}.`
              );
              return;
            }
  
            if (
              Number(
                currentShare.shareholder_id
              ) !==
              Number(
                transfer.from_shareholder_id
              )
            ) {
              setError(
                `Company Share ${item.share_id} no longer belongs to the original shareholder.`
              );
              return;
            }
  
            if (
              String(
                currentShare.status ?? ''
              )
                .trim()
                .toLowerCase() !== 'active'
            ) {
              setError(
                `Company Share ${item.share_id} is no longer active.`
              );
              return;
            }
  
            const currentPrice = Number(
              currentShare.share_price ?? 0
            );
  
            const requestPrice = Number(
              item.share_price ??
                item.par_value ??
                0
            );
  
            if (
              currentPrice !== requestPrice
            ) {
              setError(
                `Company Share ${item.share_id} value has changed. Please check the request again.`
              );
              return;
            }
          }
        }
  
        /*
 * SHARE WITHDRAWAL / CLOSURE
 *
 * The request contains the exact
 * shareholder_share_id and company_share_id
 * for every selected share.
 *
 * We verify those exact shares against the
 * applicant shareholder's current active shares.
 */
if (
  isShareWithdrawal ||
  isShareClosure
) {
  const withdrawalItem =
    items.find(
      (item: any) =>
        item?.withdrawal === true ||
        item?.closure === true
    );

  const requestedShares =
    withdrawalItem?.shares ?? [];

  const requestedQuantity = Number(
    withdrawalItem?.quantity ??
      transfer.quantity ??
      0
  );

  if (
    !Number.isInteger(
      requestedQuantity
    ) ||
    requestedQuantity <= 0
  ) {
    setError(
      'Invalid withdrawal or closure quantity.'
    );
    return;
  }

  if (
    !Array.isArray(
      requestedShares
    ) ||
    requestedShares.length === 0
  ) {
    setError(
      'No specific Company Share IDs were found in this request.'
    );
    return;
  }

  if (
    requestedShares.length !==
    requestedQuantity
  ) {
    setError(
      'The requested quantity does not match the selected Company Shares.'
    );
    return;
  }

  for (
    const requestedShare
    of requestedShares
  ) {
    const shareholderShareId =
      Number(
        requestedShare?.shareholder_share_id
      );

    const companyShareId =
      Number(
        requestedShare?.company_share_id
      );

    if (
      !Number.isInteger(
        shareholderShareId
      ) ||
      shareholderShareId <= 0 ||
      !Number.isInteger(
        companyShareId
      ) ||
      companyShareId <= 0
    ) {
      setError(
        'Invalid Company Share information in this request.'
      );
      return;
    }

    const {
      data: currentShare,
      error: shareError,
    } = await supabase
      .from('shareholder_shares')
      .select(
        'id, shareholder_id, company_share_id, quantity, status'
      )
      .eq(
        'id',
        shareholderShareId
      )
      .maybeSingle();

    if (shareError) {
      throw shareError;
    }

    if (!currentShare) {
      setError(
        `Share record ${shareholderShareId} was not found.`
      );
      return;
    }

    if (
      Number(
        currentShare.company_share_id
      ) !== companyShareId
    ) {
      setError(
        `Company Share ID mismatch for record ${shareholderShareId}.`
      );
      return;
    }

    if (
      Number(
        currentShare.shareholder_id
      ) !==
      Number(
        transfer.from_shareholder_id
      )
    ) {
      setError(
        `Company Share ${companyShareId} no longer belongs to the applicant shareholder.`
      );
      return;
    }

    if (
      String(
        currentShare.status ?? ''
      )
        .trim()
        .toLowerCase() !==
      'active'
    ) {
      setError(
        `Company Share ${companyShareId} is no longer active.`
      );
      return;
    }
  }

  const requestPrice = Number(
    transfer.share_price ?? 0
  );

  if (
    !Number.isFinite(
      requestPrice
    ) ||
    requestPrice <= 0
  ) {
    setError(
      'A valid share value is required for this request.'
    );
    return;
  }

  if (
    isShareWithdrawal
  ) {
    const beneficiaryName =
      String(
        transfer.payment_account ??
          transfer.request_items
            ?.beneficiary_name ??
          ''
      ).trim();

    const beneficiaryAccount =
      String(
        transfer.payment_account_number ??
          transfer.request_items
            ?.beneficiary_account ??
          ''
      ).trim();

    if (!beneficiaryName) {
      setError(
        'Withdrawal beneficiary name is missing.'
      );
      return;
    }

    if (!beneficiaryAccount) {
      setError(
        'Withdrawal beneficiary account is missing.'
      );
      return;
    }
  }
}
  
        const updatedRequestItems = {
          ...(transfer.request_items ?? {}),
          verification: {
            source:
              'shareholder_shares',
  
            value_verified:
              true,
  
            employee_rechecked:
              true,
  
            employee_rechecked_at:
              new Date().toISOString(),
          },
        };
  
        const {
          data: updatedTransfer,
          error: updateError,
        } = await supabase
          .from('share_transfers')
          .update({
            status:
              'employee_rechecked',
            request_items:
              updatedRequestItems,
          })
          .eq('id', transfer.id)
          .select('*')
          .maybeSingle();
  
        if (updateError) {
          throw updateError;
        }
  
        if (!updatedTransfer) {
          setError(
            'The request could not be forwarded to Accountant. Please check your permission to update transfer requests.'
          );
          return;
        }
  
        setMessage(
          'Request re-checked successfully and forwarded to Accountant.'
        );
  
        await loadData(
          currentUserRole,
          currentUserId
        );
  
        return;
      } catch (err: any) {
        console.error(
          'EMPLOYEE RECHECK ERROR:',
          err
        );
  
        setError(
          err?.message ||
            err?.details ||
            err?.hint ||
            'Unable to re-check and forward this request.'
        );
  
        return;
      }
    }
  
    /*
     * =====================================================
     * ACCOUNTANT VERIFY & FORWARD
     * =====================================================
     */
    if (
      status === 'accountant_verified'
    ) {
      if (currentUserRole !== 'Accountant') {
        setError(
          'Only an Accountant can verify and forward this request.'
        );
        return;
      }
  
      const employeeAlreadyRechecked =
        currentTransferStatus ===
          'employee_rechecked' ||
        verification?.employee_rechecked ===
          true;
  
      if (!employeeAlreadyRechecked) {
        setError(
          'This request must be re-checked by Employee before Accountant verification.'
        );
        return;
      }
  
      if (
        isShareTransfer &&
        items.length === 0
      ) {
        setError(
          'No share details were found in this request.'
        );
        return;
      }
  
      try {
        /*
         * SHARE TRANSFER VALIDATION
         */
        if (isShareTransfer) {
          for (const item of items) {
            if (
              !item?.shareholder_share_id ||
              !item?.share_id
            ) {
              setError(
                'A share record is missing from this request.'
              );
              return;
            }
  
            const {
              data: currentShare,
              error: shareError,
            } = await supabase
              .from('shareholder_shares')
              .select('*')
              .eq(
                'id',
                Number(
                  item.shareholder_share_id
                )
              )
              .maybeSingle();
  
            if (shareError) {
              throw shareError;
            }
  
            if (!currentShare) {
              setError(
                `Share record ${item.shareholder_share_id} was not found.`
              );
              return;
            }
  
            if (
              Number(
                currentShare.company_share_id
              ) !== Number(item.share_id)
            ) {
              setError(
                `Company Share ID mismatch for Share ${item.share_id}.`
              );
              return;
            }
  
            if (
              Number(
                currentShare.shareholder_id
              ) !==
              Number(
                transfer.from_shareholder_id
              )
            ) {
              setError(
                `Company Share ${item.share_id} no longer belongs to the original shareholder.`
              );
              return;
            }
  
            if (
              String(
                currentShare.status ?? ''
              )
                .trim()
                .toLowerCase() !== 'active'
            ) {
              setError(
                `Company Share ${item.share_id} is no longer active.`
              );
              return;
            }
  
            const currentPrice = Number(
              currentShare.share_price ?? 0
            );
  
            const requestPrice = Number(
              item.share_price ??
                item.par_value ??
                0
            );
  
            if (
              currentPrice !== requestPrice
            ) {
              setError(
                `Company Share ${item.share_id} value does not match the current database value.`
              );
              return;
            }
          }
        }
  
        /*
 * WITHDRAWAL / CLOSURE VALIDATION
 *
 * The request contains the exact
 * shareholder_share_id and company_share_id
 * for every selected share.
 *
 * We verify those exact shares against the
 * applicant shareholder's current active shares.
 */
if (
  isShareWithdrawal ||
  isShareClosure
) {
  const withdrawalItem =
    items.find(
      (item: any) =>
        item?.withdrawal === true ||
        item?.closure === true
    );

  const requestedShares =
    withdrawalItem?.shares ?? [];

  const requestedQuantity = Number(
    withdrawalItem?.quantity ??
      transfer.quantity ??
      0
  );

  if (
    !Number.isInteger(
      requestedQuantity
    ) ||
    requestedQuantity <= 0
  ) {
    setError(
      'Invalid withdrawal or closure quantity.'
    );
    return;
  }

  if (
    !Array.isArray(
      requestedShares
    ) ||
    requestedShares.length === 0
  ) {
    setError(
      'No specific Company Share IDs were found in this request.'
    );
    return;
  }

  if (
    requestedShares.length !==
    requestedQuantity
  ) {
    setError(
      'The requested quantity does not match the selected Company Shares.'
    );
    return;
  }

  for (
    const requestedShare
    of requestedShares
  ) {
    const shareholderShareId =
      Number(
        requestedShare?.shareholder_share_id
      );

    const companyShareId =
      Number(
        requestedShare?.company_share_id
      );

    if (
      !Number.isInteger(
        shareholderShareId
      ) ||
      shareholderShareId <= 0 ||
      !Number.isInteger(
        companyShareId
      ) ||
      companyShareId <= 0
    ) {
      setError(
        'Invalid Company Share information in this request.'
      );
      return;
    }

    const {
      data: currentShare,
      error: shareError,
    } = await supabase
      .from('shareholder_shares')
      .select(
        'id, shareholder_id, company_share_id, quantity, status'
      )
      .eq(
        'id',
        shareholderShareId
      )
      .maybeSingle();

    if (shareError) {
      throw shareError;
    }

    if (!currentShare) {
      setError(
        `Share record ${shareholderShareId} was not found.`
      );
      return;
    }

    if (
      Number(
        currentShare.company_share_id
      ) !== companyShareId
    ) {
      setError(
        `Company Share ID mismatch for record ${shareholderShareId}.`
      );
      return;
    }

    if (
      Number(
        currentShare.shareholder_id
      ) !==
      Number(
        transfer.from_shareholder_id
      )
    ) {
      setError(
        `Company Share ${companyShareId} no longer belongs to the applicant shareholder.`
      );
      return;
    }

    if (
      String(
        currentShare.status ?? ''
      )
        .trim()
        .toLowerCase() !==
      'active'
    ) {
      setError(
        `Company Share ${companyShareId} is no longer active.`
      );
      return;
    }
  }

  const currentRequestPrice =
    Number(
      transfer.share_price ?? 0
    );

  if (
    !Number.isFinite(
      currentRequestPrice
    ) ||
    currentRequestPrice <= 0
  ) {
    setError(
      'A valid share value is required for this request.'
    );
    return;
  }

  if (
    isShareWithdrawal
  ) {
    const beneficiaryName =
      String(
        transfer.payment_account ??
          transfer.request_items
            ?.beneficiary_name ??
          ''
      ).trim();

    const beneficiaryAccount =
      String(
        transfer.payment_account_number ??
          transfer.request_items
            ?.beneficiary_account ??
          ''
      ).trim();

    if (!beneficiaryName) {
      setError(
        'Withdrawal beneficiary name is missing.'
      );
      return;
    }

    if (!beneficiaryAccount) {
      setError(
        'Withdrawal beneficiary account is missing.'
      );
      return;
    }
  }
}
  
        const updatedRequestItems = {
          ...(transfer.request_items ?? {}),
          verification: {
            source:
              'shareholder_shares',
  
            value_verified:
              true,
  
            employee_rechecked:
              true,
  
            employee_rechecked_at:
              verification?.employee_rechecked_at ??
              new Date().toISOString(),
  
            accountant_verified:
              true,
  
            accountant_verified_at:
              new Date().toISOString(),
          },
        };
  
        const {
          data: updatedTransfer,
          error: updateError,
        } = await supabase
          .from('share_transfers')
          .update({
            status:
              'accountant_verified',
            request_items:
              updatedRequestItems,
          })
          .eq('id', transfer.id)
          .select('*')
          .maybeSingle();
  
        if (updateError) {
          throw updateError;
        }
  
        if (!updatedTransfer) {
          setError(
            'The request could not be forwarded to Admin. Please check Accountant update permission.'
          );
          return;
        }
  
        setMessage(
          'Request verified successfully and forwarded to Admin.'
        );
  
        await loadData(
          currentUserRole,
          currentUserId
        );
  
        return;
      } catch (err: any) {
        console.error(
          'ACCOUNTANT VERIFICATION ERROR:',
          err
        );
  
        setError(
          err?.message ||
            err?.details ||
            err?.hint ||
            'Unable to verify and forward this request.'
        );
  
        return;
      }
    }
  
    /*
     * =====================================================
     * ADMIN REJECT
     * =====================================================
     */
    if (status === 'rejected') {
      if (currentUserRole !== 'Admin') {
        setError(
          'Only Admin can reject a transfer request.'
        );
        return;
      }
  
      const accountantAlreadyVerified =
        currentTransferStatus ===
          'accountant_verified' ||
        verification?.accountant_verified ===
          true;
  
      if (!accountantAlreadyVerified) {
        setError(
          'Only Accountant-verified requests can be rejected here.'
        );
        return;
      }
  
      try {
        const {
          data: rejectedTransfer,
          error: updateError,
        } = await supabase
          .from('share_transfers')
          .update({
            status: 'rejected',
          })
          .eq('id', transfer.id)
          .select('*')
          .maybeSingle();
  
        if (updateError) {
          throw updateError;
        }
  
        if (!rejectedTransfer) {
          setError(
            'The transfer request could not be rejected.'
          );
          return;
        }
  
        setMessage(
          'Transfer request rejected successfully.'
        );
  
        await loadData(
          currentUserRole,
          currentUserId
        );
      } catch (err: any) {
        console.error(
          'REJECT TRANSFER ERROR:',
          err
        );
  
        setError(
          err?.message ||
            err?.details ||
            err?.hint ||
            'Unable to reject transfer request.'
        );
      }
  
      return;
    }
  
    /*
     * =====================================================
     * ADMIN APPROVAL
     * =====================================================
     */
    if (status === 'approved') {
      if (currentUserRole !== 'Admin') {
        setError(
          'Only Admin can approve a transfer request.'
        );
        return;
      }
  
      const accountantAlreadyVerified =
        currentTransferStatus ===
          'accountant_verified' ||
        verification?.accountant_verified ===
          true;
  
      if (!accountantAlreadyVerified) {
        setError(
          'This request must be verified by Accountant before Admin approval.'
        );
        return;
      }
  
      /*
       * ===================================================
       * SHARE TRANSFER APPROVAL
       * ===================================================
       */
      if (isShareTransfer) {
        const fromShareholderId =
          Number(
            transfer.from_shareholder_id
          );
  
        const toShareholderId =
          Number(
            transfer.to_shareholder_id
          );
  
        if (
          !Number.isInteger(
            fromShareholderId
          ) ||
          fromShareholderId <= 0
        ) {
          setError(
            'Invalid source shareholder.'
          );
          return;
        }
  
        if (
          !Number.isInteger(
            toShareholderId
          ) ||
          toShareholderId <= 0
        ) {
          setError(
            'Invalid receiving shareholder.'
          );
          return;
        }
  
        if (
          fromShareholderId ===
          toShareholderId
        ) {
          setError(
            'Source and receiving shareholder cannot be the same.'
          );
          return;
        }
  
        if (items.length === 0) {
          setError(
            'No shareholder shares were selected for this transfer.'
          );
          return;
        }
  
        try {
          const verifiedShares: GenericRow[] =
            [];
  
          /*
           * STEP 1:
           * Validate every requested share.
           */
          for (const item of items) {
            const shareholderShareId =
              Number(
                item?.shareholder_share_id
              );
  
            const companyShareId =
              Number(item?.share_id);
  
            const requestedQuantity =
              Number(
                item?.quantity ?? 0
              );
  
            if (
              !Number.isInteger(
                shareholderShareId
              ) ||
              shareholderShareId <= 0
            ) {
              setError(
                'Invalid shareholder share record in transfer request.'
              );
              return;
            }
  
            if (
              !Number.isInteger(
                companyShareId
              ) ||
              companyShareId <= 0
            ) {
              setError(
                'Invalid company share ID in transfer request.'
              );
              return;
            }
  
            if (
              !Number.isInteger(
                requestedQuantity
              ) ||
              requestedQuantity <= 0
            ) {
              setError(
                `Invalid quantity for Company Share ${companyShareId}.`
              );
              return;
            }
  
            const {
              data: sourceShare,
              error: sourceError,
            } = await supabase
              .from('shareholder_shares')
              .select('*')
              .eq(
                'id',
                shareholderShareId
              )
              .maybeSingle();
  
            if (sourceError) {
              throw sourceError;
            }
  
            if (!sourceShare) {
              setError(
                `Shareholder share record ${shareholderShareId} was not found.`
              );
              return;
            }
  
            if (
              Number(
                sourceShare.shareholder_id
              ) !== fromShareholderId
            ) {
              setError(
                `Company Share ${companyShareId} no longer belongs to the original shareholder.`
              );
              return;
            }
  
            if (
              String(
                sourceShare.status ?? ''
              )
                .trim()
                .toLowerCase() !== 'active'
            ) {
              setError(
                `Company Share ${companyShareId} is not active and cannot be transferred.`
              );
              return;
            }
  
            if (
              Number(
                sourceShare.company_share_id
              ) !== companyShareId
            ) {
              setError(
                `Company Share ID mismatch for Share ${companyShareId}.`
              );
              return;
            }
  
            const availableQuantity =
              Number(
                sourceShare.quantity ?? 0
              );
  
            if (
              requestedQuantity !==
              availableQuantity
            ) {
              setError(
                `Company Share ${companyShareId} has quantity ${availableQuantity}, but the request contains ${requestedQuantity}.`
              );
              return;
            }
  
            const currentPrice =
              Number(
                sourceShare.share_price ?? 0
              );
  
            const requestPrice =
              Number(
                item?.share_price ??
                  item?.par_value ??
                  0
              );
  
            if (
              currentPrice !==
              requestPrice
            ) {
              setError(
                `Company Share ${companyShareId} value changed after verification. Approval has been stopped.`
              );
              return;
            }
  
            verifiedShares.push(
              sourceShare
            );
          }
  
          /*
           * STEP 2:
           * Move ownership.
           */
          for (const sourceShare of verifiedShares) {
            const {
              data: movedShare,
              error: moveError,
            } = await supabase
              .from('shareholder_shares')
              .update({
                shareholder_id:
                  toShareholderId,
                status: 'active',
              })
              .eq(
                'id',
                sourceShare.id
              )
              .eq(
                'shareholder_id',
                fromShareholderId
              )
              .select('*')
              .maybeSingle();
  
            if (moveError) {
              throw moveError;
            }
  
            if (!movedShare) {
              setError(
                `Company Share ${sourceShare.company_share_id} could not be moved.`
              );
              return;
            }
  
            if (
              Number(
                movedShare.shareholder_id
              ) !== toShareholderId
            ) {
              setError(
                `Company Share ${sourceShare.company_share_id} was not assigned to the receiving shareholder.`
              );
              return;
            }
          }
  
          /*
           * STEP 3:
           * Mark transfer approved.
           */
          const {
            data: approvedTransfer,
            error: approvalError,
          } = await supabase
            .from('share_transfers')
            .update({
              status: 'approved',
            })
            .eq('id', transfer.id)
            .select('*')
            .maybeSingle();
  
          if (approvalError) {
            throw approvalError;
          }
  
          if (!approvedTransfer) {
            setError(
              'Ownership was moved, but the transfer approval could not be saved.'
            );
            return;
          }
  
          setMessage(
            'Transfer approved successfully. The selected shares have been moved to the receiving shareholder.'
          );
  
          await loadData(
            currentUserRole,
            currentUserId
          );
        } catch (err: any) {
          console.error(
            'ADMIN APPROVAL ERROR:',
            err
          );
  
          setError(
            err?.message ||
              err?.details ||
              err?.hint ||
              'Unable to approve transfer request.'
          );
        }
  
        return;
      }
  
      /*
 * ===================================================
 * SHARE WITHDRAWAL / CLOSURE APPROVAL
 *
 * The request already contains the exact
 * shareholder_share_id and company_share_id
 * for every share selected for withdrawal/closure.
 *
 * We verify those exact shares before removing them.
 * ===================================================
 */
      if (
        isShareWithdrawal ||
        isShareClosure
      ) {
        try {
          const withdrawalItem = items.find(
            (item: any) =>
              item?.withdrawal === true ||
              item?.closure === true
          );
      
          const requestedShares =
            withdrawalItem?.shares ?? [];
      
          if (
            !Array.isArray(requestedShares) ||
            requestedShares.length === 0
          ) {
            setError(
              'No specific Company Share IDs were found in this request.'
            );
            return;
          }
      
          const requestedQuantity = Number(
            withdrawalItem?.quantity ?? 0
          );
      
          if (
            !Number.isInteger(requestedQuantity) ||
            requestedQuantity <= 0
          ) {
            setError(
              'Invalid withdrawal or closure quantity.'
            );
            return;
          }
      
          if (
            requestedShares.length !==
            requestedQuantity
          ) {
            setError(
              'The requested quantity does not match the selected Company Shares.'
            );
            return;
          }
      
          for (const share of requestedShares) {
            const shareholderShareId = Number(
              share?.shareholder_share_id
            );
      
            const companyShareId = Number(
              share?.company_share_id
            );
      
            if (
              !Number.isInteger(
                shareholderShareId
              ) ||
              shareholderShareId <= 0 ||
              !Number.isInteger(
                companyShareId
              ) ||
              companyShareId <= 0
            ) {
              setError(
                'Invalid Company Share information in this request.'
              );
              return;
            }
      
            const {
              data: currentShare,
              error: shareError,
            } = await supabase
              .from('shareholder_shares')
              .select('*')
              .eq(
                'id',
                shareholderShareId
              )
              .maybeSingle();
      
            if (shareError) {
              throw shareError;
            }
      
            if (!currentShare) {
              setError(
                `Share record ${shareholderShareId} was not found.`
              );
              return;
            }
      
            if (
              Number(
                currentShare.company_share_id
              ) !== companyShareId
            ) {
              setError(
                `Company Share ID mismatch for record ${shareholderShareId}.`
              );
              return;
            }
      
            if (
              Number(
                currentShare.shareholder_id
              ) !==
              Number(
                transfer.from_shareholder_id
              )
            ) {
              setError(
                `Company Share ${companyShareId} no longer belongs to the applicant shareholder.`
              );
              return;
            }
      
            if (
              String(
                currentShare.status ?? ''
              )
                .trim()
                .toLowerCase() !== 'active'
            ) {
              setError(
                `Company Share ${companyShareId} is no longer active.`
              );
              return;
            }
          }
      
          for (const share of requestedShares) {
            const shareholderShareId = Number(
              share?.shareholder_share_id
            );
          
            const {
              data: updatedShare,
              error: updateShareError,
            } = await supabase
              .from('shareholder_shares')
              .update({
                status: 'cancelled',
              })
              .eq(
                'id',
                shareholderShareId
              )
              .eq(
                'shareholder_id',
                Number(
                  transfer.from_shareholder_id
                )
              )
              .eq('status', 'active')
              .select(
                'id, company_share_id, status'
              )
              .maybeSingle();
            
            if (updateShareError) {
              throw updateShareError;
            }
            
            if (!updatedShare) {
              setError(
                `Company Share ${share.company_share_id} could not be withdrawn/closed.`
              );
              return;
            }
          }
          
          const {
            data: approvedTransfer,
            error: approvalError,
          } = await supabase
            .from('share_transfers')
            .update({
              status: 'approved',
            })
            .eq('id', transfer.id)
            .select('*')
            .maybeSingle();
          
          if (approvalError) {
            throw approvalError;
          }
          
          if (!approvedTransfer) {
            setError(
              'The shares were removed, but the request approval could not be saved.'
            );
            return;
          }
          
          setMessage(
            isShareWithdrawal
              ? 'Share withdrawal approved successfully.'
              : 'Share closure approved successfully.'
          );
          const paymentRows =
  requestedShares.map(
    (share: any) => ({
      shareholder_id:
        Number(
          transfer.from_shareholder_id
        ),

      shareholder_share_id:
        Number(
          share.company_share_id
        ),

      amount:
        Number(
          withdrawalItem?.share_price ??
            transfer.share_price ??
            0
        ),

      payment_date:
        new Date()
          .toISOString()
          .slice(0, 10),

      payment_method:
        String(
          withdrawalItem?.payment_method ??
            ''
        ).trim() || null,

      reference_no:
        null,
        status:
        'pending',   
    })
  );

const {
  error: paymentInsertError,
} = await supabase
  .from('shareholder_payments')
  .insert(paymentRows);

if (paymentInsertError) {
  throw paymentInsertError;
}
          
          await loadData(
            currentUserRole,
            currentUserId
          );
      
        } catch (err: any) {
          console.error(
            'WITHDRAWAL/CLOSURE APPROVAL VALIDATION ERROR:',
            err
          );
      
          setError(
            err?.message ||
              err?.details ||
              err?.hint ||
              'Unable to verify withdrawal/closure shares.'
          );
        }
      
        return;
      }
  
      setError(
        'Unsupported share request type.'
      );
      return;
    }
  };
  const renderGenericPage = (
    config: GenericConfig
  ) => {
    const data = rows[config.table] ?? [];
  
    const isEditing =
      editing?.table === config.table;
  
    const isShareholderDividends =
      config.table === 'shareholder_dividends';
  
    const isShareholderPayments =
      config.table === 'shareholder_payments';
  
    const isBooking =
      config.table === 'bookings';
  
    const isAdmin =
      currentUserRole === 'Admin';
  
    const permissionModuleMap: Record<
      string,
      string
    > = {
      dividends: 'dividend',
      shareholder_dividends:
        'shareholder-dividends',
      shareholder_payments:
        'shareholder-payments',
      company_share_configuration:
        'share-settings',
      notice_deliveries: 'notices',
    };
  
    const permissionModule =
      permissionModuleMap[
        config.table
      ] ?? config.table;
  
    const getShareholderName = (
      shareholderId: any
    ) => {
      const shareholder =
        shareholders.find(
          (item) =>
            String(item.id ?? '') ===
            String(shareholderId ?? '')
        );
  
      if (!shareholder) {
        return String(
          shareholderId ?? '—'
        );
      }
  
      return `${shareholder.company_shareholder_id ?? '—'} - ${
        shareholder.full_name ?? ''
      }`;
    };
  
    const getDividendLabel = (
      dividendId: any
    ) => {
      const dividendRows =
        rows.dividends ?? [];
  
      const dividend =
        dividendRows.find(
          (item: any) =>
            String(item.id ?? '') ===
            String(dividendId ?? '')
        );
  
      if (!dividend) {
        return String(
          dividendId ?? '—'
        );
      }
  
      return `${dividend.dividend_year ?? '—'} - ${
        dividend.dividend_rate ?? 0
      } per share`;
    };
  
    const getBookingPaymentSummary = (
      bookingId: any
    ) => {
      const paymentRows =
        rows.payments ?? [];
  
      const totalPaid =
        paymentRows
          .filter(
            (payment: any) =>
              String(
                payment.booking_id ?? ''
              ) ===
              String(
                bookingId ?? ''
              )
          )
          .reduce(
            (
              total: number,
              payment: any
            ) =>
              total +
              Number(
                payment.amount ?? 0
              ),
            0
          );
  
      return Math.max(
        totalPaid,
        0
      );
    };
  
    const getDisplayKeys = (
      rowData: GenericRow[]
    ) => {
      if (!rowData.length) {
        return [];
      }
  
      if (isShareholderDividends) {
        return [
          'dividend_id',
          'shareholder_id',
          'share_quantity',
          'dividend_amount',
          'paid_amount',
          'due_amount',
          'status',
        ];
      }
  
      if (isBooking) {
        return [
          'customer_id',
          'property_id',
          'booking_date',
          'booking_amount',
          'paid_amount',
          'due_amount',
          'status',
        ];
      }
  
      const keys = Object.keys(
        rowData[0]
      ).filter(
        (key) =>
          ![
            'created_at',
            'updated_at',
          ].includes(key)
      );
  
      if (
        config.table ===
        'shareholder_payments'
      ) {
        keys.splice(
          8,
          keys.length - 8,
          'status'
        );
      }
  
      return keys.slice(0, 8);
    };
  
    const displayKeys =
      getDisplayKeys(data);
  
    const createDividendPaymentRequest =
      async (row: GenericRow) => {
        clearMessages();
  
        if (
          currentUserRole !==
          'Accountant'
        ) {
          setError(
            'Only an Accountant can create a dividend payment request.'
          );
          return;
        }
  
        if (!row?.id) {
          setError(
            'Invalid shareholder dividend record.'
          );
          return;
        }
  
        const dueAmount =
          Number(
            row.due_amount ?? 0
          );
  
        if (
          !Number.isFinite(
            dueAmount
          ) ||
          dueAmount <= 0
        ) {
          setError(
            'There is no outstanding dividend amount for this record.'
          );
          return;
        }
  
        try {
          const {
            data: existingRequests,
            error: existingRequestError,
          } = await supabase
            .from(
              'dividend_payment_requests'
            )
            .select(
              'id, status'
            )
            .eq(
              'shareholder_dividend_id',
              row.id
            )
            .in(
              'status',
              [
                'pending',
                'approved',
                'paid',
              ]
            )
            .limit(1);
  
          if (
            existingRequestError
          ) {
            throw existingRequestError;
          }
  
          if (
            existingRequests?.length
          ) {
            setError(
              'A payment request already exists for this dividend.'
            );
            return;
          }
  
          const {
            data: sessionData,
            error: sessionError,
          } =
            await supabase.auth.getSession();
  
          if (sessionError) {
            throw sessionError;
          }
  
          const userId =
            sessionData.session?.user?.id;
  
          if (!userId) {
            setError(
              'Please log in again.'
            );
            return;
          }
  
          const paymentAmount =
            dueAmount;
  
          const {
            error: insertError,
          } = await supabase
            .from(
              'dividend_payment_requests'
            )
            .insert({
              shareholder_dividend_id:
                Number(row.id),
              shareholder_id:
                Number(
                  row.shareholder_id
                ),
              dividend_amount:
                Number(
                  row.dividend_amount ?? 0
                ),
              payment_amount:
                paymentAmount,
              payment_method:
                null,
              reference_no:
                null,
              notes:
                `Dividend payment request for ${getShareholderName(
                  row.shareholder_id
                )}.`,
              status:
                'pending',
              requested_by:
                userId,
            });
  
          if (insertError) {
            throw insertError;
          }
  
          setMessage(
            'Dividend Payment Request successfully transferred to Admin.'
          );
  
          await loadData(
            currentUserRole,
            currentUserId
          );
        } catch (err: any) {
          console.error(
            'CREATE DIVIDEND PAYMENT REQUEST ERROR:',
            err
          );
  
          setError(
            err?.message ||
              'Unable to create dividend payment request.'
          );
        }
      };
  
    const pendingDividendPaymentRequests =
      isAdmin &&
      isShareholderDividends
        ? (
            rows.dividend_payment_requests ??
            []
          ).filter(
            (request: any) =>
              String(
                request.status ?? ''
              ).toLowerCase() ===
              'pending'
          )
        : [];
  
    const approveDividendPaymentRequest =
      async (request: GenericRow) => {
        clearMessages();
  
        if (
          currentUserRole !==
          'Admin'
        ) {
          setError(
            'Only an Admin can approve a dividend payment request.'
          );
          return;
        }
  
        if (!request?.id) {
          setError(
            'Invalid dividend payment request.'
          );
          return;
        }
  
        if (
          String(
            request.status ?? ''
          ).toLowerCase() !==
          'pending'
        ) {
          setError(
            'This payment request is no longer pending.'
          );
          return;
        }
  
        const shareholderDividendId =
          Number(
            request.shareholder_dividend_id
          );
  
        const paymentAmount =
          Number(
            request.payment_amount ?? 0
          );
  
        if (
          !Number.isInteger(
            shareholderDividendId
          ) ||
          shareholderDividendId <= 0
        ) {
          setError(
            'Invalid shareholder dividend record.'
          );
          return;
        }
  
        if (
          !Number.isFinite(
            paymentAmount
          ) ||
          paymentAmount <= 0
        ) {
          setError(
            'Payment amount must be greater than zero.'
          );
          return;
        }
  
        try {
          const {
            data: sessionData,
            error: sessionError,
          } =
            await supabase.auth.getSession();
  
          if (sessionError) {
            throw sessionError;
          }
  
          const adminUserId =
            sessionData.session?.user?.id;
  
          if (!adminUserId) {
            setError(
              'Please log in again.'
            );
            return;
          }
  
          const {
            data: dividendData,
            error: dividendError,
          } = await supabase
            .from(
              'shareholder_dividends'
            )
            .select(
              'id, dividend_amount, paid_amount, status'
            )
            .eq(
              'id',
              shareholderDividendId
            )
            .maybeSingle();
  
          if (dividendError) {
            throw dividendError;
          }
  
          if (!dividendData) {
            setError(
              'The shareholder dividend record could not be found.'
            );
            return;
          }
  
          const dividendAmount =
            Number(
              dividendData.dividend_amount ?? 0
            );
  
          const currentPaidAmount =
            Number(
              dividendData.paid_amount ?? 0
            );
  
          if (
            !Number.isFinite(
              dividendAmount
            ) ||
            dividendAmount <= 0
          ) {
            setError(
              'Invalid dividend amount.'
            );
            return;
          }
  
          if (
            !Number.isFinite(
              currentPaidAmount
            ) ||
            currentPaidAmount < 0
          ) {
            setError(
              'Invalid current paid amount.'
            );
            return;
          }
  
          if (
            currentPaidAmount >=
            dividendAmount
          ) {
            setError(
              'This dividend has already been fully paid.'
            );
            return;
          }
  
          const {
            error:
              requestUpdateError,
          } = await supabase
            .from(
              'dividend_payment_requests'
            )
            .update({
              status:
                'approved',
              approved_by:
                adminUserId,
              approved_at:
                new Date().toISOString(),
            })
            .eq(
              'id',
              request.id
            )
            .eq(
              'status',
              'pending'
            );
  
          if (requestUpdateError) {
            throw requestUpdateError;
          }
  
          setMessage(
            'Dividend payment request approved successfully. Payment is now pending with the Accountant.'
          );
  
          await loadData(
            currentUserRole,
            currentUserId
          );
        } catch (err: any) {
          console.error(
            'APPROVE DIVIDEND PAYMENT REQUEST ERROR:',
            err
          );
  
          setError(
            err?.message ||
              'Unable to approve dividend payment request.'
          );
        }
      };
  
    const makeDividendPayment =
      async (
        row: GenericRow
      ) => {
        clearMessages();
  
        if (
          currentUserRole !==
          'Accountant'
        ) {
          setError(
            'Only an Accountant can make a dividend payment.'
          );
          return;
        }
  
        if (!row?.id) {
          setError(
            'Invalid shareholder dividend record.'
          );
          return;
        }
  
        const request =
          (
            rows.dividend_payment_requests ??
            []
          ).find(
            (item: any) =>
              String(
                item.shareholder_dividend_id ??
                  ''
              ) ===
              String(
                row.id ?? ''
              ) &&
              String(
                item.status ?? ''
              ).toLowerCase() ===
                'approved'
          );
  
        if (!request) {
          setError(
            'This dividend payment has not been approved by the Admin.'
          );
          return;
        }
  
        const shareholderDividendId =
          Number(
            row.id
          );
  
        const paymentAmount =
          Number(
            request.payment_amount ?? 0
          );
  
        if (
          !Number.isInteger(
            shareholderDividendId
          ) ||
          shareholderDividendId <= 0
        ) {
          setError(
            'Invalid shareholder dividend record.'
          );
          return;
        }
  
        if (
          !Number.isFinite(
            paymentAmount
          ) ||
          paymentAmount <= 0
        ) {
          setError(
            'Invalid payment amount.'
          );
          return;
        }
  
        try {
          const {
            data: sessionData,
            error: sessionError,
          } =
            await supabase.auth.getSession();
  
          if (sessionError) {
            throw sessionError;
          }
  
          const accountantUserId =
            sessionData.session?.user?.id;
  
          if (!accountantUserId) {
            setError(
              'Please log in again.'
            );
            return;
          }
  
          const {
            data: dividendData,
            error: dividendError,
          } = await supabase
            .from(
              'shareholder_dividends'
            )
            .select(
              'id, shareholder_id, dividend_amount, paid_amount, due_amount, status'
            )
            .eq(
              'id',
              shareholderDividendId
            )
            .maybeSingle();
  
          if (dividendError) {
            throw dividendError;
          }
  
          if (!dividendData) {
            setError(
              'The shareholder dividend record could not be found.'
            );
            return;
          }
  
          const dividendAmount =
            Number(
              dividendData.dividend_amount ?? 0
            );
  
          const currentPaidAmount =
            Number(
              dividendData.paid_amount ?? 0
            );
  
          const currentDueAmount =
            Number(
              dividendData.due_amount ??
                Math.max(
                  dividendAmount -
                    currentPaidAmount,
                  0
                )
            );
  
          if (
            !Number.isFinite(
              dividendAmount
            ) ||
            dividendAmount <= 0
          ) {
            setError(
              'Invalid dividend amount.'
            );
            return;
          }
  
          if (
            !Number.isFinite(
              currentPaidAmount
            ) ||
            currentPaidAmount < 0
          ) {
            setError(
              'Invalid current paid amount.'
            );
            return;
          }
  
          if (
            !Number.isFinite(
              currentDueAmount
            ) ||
            currentDueAmount <= 0
          ) {
            setError(
              'This dividend has already been fully paid.'
            );
            return;
          }
  
          if (
            paymentAmount >
            currentDueAmount
          ) {
            setError(
              'Payment amount cannot be greater than the outstanding dividend amount.'
            );
            return;
          }
  
          const newPaidAmount =
            currentPaidAmount +
            paymentAmount;
  
          const newStatus =
            newPaidAmount >=
            dividendAmount
              ? 'paid'
              : 'pending';
  
          const {
            error:
              paymentInsertError,
          } = await supabase
            .from(
              'shareholder_payments'
            )
            .insert({
              shareholder_id:
                Number(
                  dividendData.shareholder_id
                ),
              amount:
                paymentAmount,
              payment_date:
                new Date()
                  .toISOString()
                  .slice(0, 10),
              payment_method:
                'Dividend Payment',
              reference_no:
                `Dividend Request #${request.id}`,
              notes:
                `Dividend payment for ${getShareholderName(
                  dividendData.shareholder_id
                )}. Shareholder Dividend ID #${shareholderDividendId}.`,
              status:
                'done',
            });
  
          if (paymentInsertError) {
            throw paymentInsertError;
          }
  
          const {
            error:
              dividendUpdateError,
          } = await supabase
            .from(
              'shareholder_dividends'
            )
            .update({
              paid_amount:
                newPaidAmount,
              status:
                newStatus,
            })
            .eq(
              'id',
              shareholderDividendId
            );
  
          if (dividendUpdateError) {
            throw dividendUpdateError;
          }
  
          const {
            error:
              requestUpdateError,
          } = await supabase
            .from(
              'dividend_payment_requests'
            )
            .update({
              status:
                'paid',
              paid_at:
                new Date().toISOString(),
            })
            .eq(
              'id',
              request.id
            )
            .eq(
              'status',
              'approved'
            );
  
          if (requestUpdateError) {
            throw requestUpdateError;
          }
  
          setMessage(
            'Dividend payment completed successfully. The payment has been added to Shareholder Payments.'
          );
  
          await loadData(
            currentUserRole,
            currentUserId
          );
        } catch (err: any) {
          console.error(
            'MAKE DIVIDEND PAYMENT ERROR:',
            err
          );
  
          setError(
            err?.message ||
              'Unable to complete dividend payment.'
          );
        }
      };
  
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {config.title}
            </h2>
  
            <p className="mt-1 text-sm text-slate-500">
              {isShareholderDividends
                ? 'View shareholder dividend entitlement, paid amount and outstanding due.'
                : isBooking
                ? 'Manage customer property bookings, payments and outstanding due.'
                : `Manage ${config.title.toLowerCase()} records.`}
            </p>
          </div>
  
          {!isShareholderDividends &&
            currentUserRole !==
              'Shareholder' &&
            currentUserRole !==
              'Visitor' &&
            (
              rows.permissions ?? []
            ).some(
              (permission: any) =>
                String(
                  permission.role ?? ''
                )
                  .trim()
                  .toLowerCase() ===
                  currentUserRole.toLowerCase() &&
                String(
                  permission.module ?? ''
                )
                  .trim()
                  .toLowerCase() ===
                  String(
                    permissionModule ?? ''
                  )
                    .trim()
                    .toLowerCase() &&
                permission.can_create === true
            ) && (
              <button
                className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700"
                onClick={() =>
                  beginNewGenericRow(
                    config.table
                  )
                }
              >
                + Add New
              </button>
            )}
        </div>
  
        {isAdmin &&
          isShareholderDividends &&
          pendingDividendPaymentRequests.length >
            0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Pending Dividend Payment Requests
                </h3>
  
                <p className="mt-1 text-sm text-slate-600">
                  Accountant থেকে Admin approval-এর জন্য পাঠানো payment request এখানে দেখা যাবে।
                </p>
              </div>
  
              <div className="space-y-3">
                {pendingDividendPaymentRequests.map(
                  (
                    request: any
                  ) => (
                    <div
                      key={
                        request.id
                      }
                      className="rounded-xl border border-amber-200 bg-white p-4"
                    >
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-500">
                            Request ID
                          </p>
  
                          <p className="mt-1 font-semibold text-slate-900">
                            #{request.id}
                          </p>
                        </div>
  
                        <div>
                          <p className="text-xs font-semibold text-slate-500">
                            Shareholder
                          </p>
  
                          <p className="mt-1 font-semibold text-slate-900">
                            {getShareholderName(
                              request.shareholder_id
                            )}
                          </p>
                        </div>
  
                        <div>
                          <p className="text-xs font-semibold text-slate-500">
                            Payment Amount
                          </p>
  
                          <p className="mt-1 font-semibold text-slate-900">
                            {formatMoney(
                              Number(
                                request.payment_amount ??
                                  0
                              )
                            )}
                          </p>
                        </div>
  
                        <div>
                          <p className="text-xs font-semibold text-slate-500">
                            Status
                          </p>
  
                          <span className="mt-1 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            Waiting for Approval
                          </span>
                        </div>
                      </div>
  
                      <div className="mt-3 border-t border-slate-100 pt-3">
                        <p className="text-xs text-slate-500">
                          Requested:{' '}
                          {request.requested_at
                            ? new Date(
                                request.requested_at
                              ).toLocaleString(
                                'en-BD'
                              )
                            : '—'}
                        </p>
  
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
                            onClick={() =>
                              approveDividendPaymentRequest(
                                request
                              )
                            }
                          >
                            Approve Payment
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
  
        {isEditing && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold">
                {editing?.row?.id
                  ? 'Edit Record'
                  : 'Add Record'}
              </h3>
  
              <button
                className="rounded-lg border px-3 py-2 text-sm font-medium"
                onClick={
                  cancelGenericEdit
                }
              >
                Cancel
              </button>
            </div>
  
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {config.fields.map(
                (field) => {
                  const value =
                    genericForm[
                      field.key
                    ] ?? '';
                    if (
                      config.table === 'notice_deliveries' &&
                      field.key === 'notice_id'
                    ) {
                      return (
                        <SelectInput
                          key={field.key}
                          label={field.label}
                          value={value}
                          required={field.required}
                          options={[
                            {
                              value: '',
                              label: 'Select Notice',
                            },
                            ...(rows.notices ?? []).map(
                              (item: any) => ({
                                value: String(item.id),
                                label: `${item.id} - ${item.title ?? ''}`,
                              })
                            ),
                          ]}
                          onChange={(event) =>
                            setGenericForm((old) => ({
                              ...old,
                              [field.key]:
                                event.target.value,
                            }))
                          }
                        />
                      );
                    }
                    if (
                      config.table === 'notice_deliveries' &&
                      field.key === 'recipient_type'
                    ) {
                      return (
                        <SelectInput
                          key={field.key}
                          label={field.label}
                          value={value}
                          required={field.required}
                          options={[
                            {
                              value: '',
                              label: 'Select Recipient Type',
                            },
                            {
                              value: 'Shareholder',
                              label: 'Shareholder',
                            },
                            {
                              value: 'Employee',
                              label: 'Employee',
                            },
                            {
                              value: 'Accountant',
                              label: 'Accountant',
                            },
                            {
                              value: 'Manager',
                              label: 'Manager',
                            },
                            {
                              value: 'Customer',
                              label: 'Customer',
                            },
                            {
                              value: 'Other',
                              label: 'Other',
                            },
                          ]}
                          onChange={(event) =>
                            setGenericForm((old) => ({
                              ...old,
                              [field.key]:
                                event.target.value,
                            }))
                          }
                        />
                      );
                    }
                    if (
                      config.table === 'notice_deliveries' &&
                      field.key === 'recipient_id'
                    ) {
                      return (
                        <SelectInput
                          key={field.key}
                          label={field.label}
                          value={value}
                          required={field.required}
                          options={[
                            {
                              value: '',
                              label: 'Select Recipient',
                            },
                            ...shareholders.map(
                              (item: any) => ({
                                value: String(item.id),
                                label: `${item.company_shareholder_id ?? '—'} - ${
                                  item.full_name ?? ''
                                }`,
                              })
                            ),
                          ]}
                          onChange={(event) =>
                            setGenericForm((old) => ({
                              ...old,
                              [field.key]:
                                event.target.value,
                            }))
                          }
                        />
                      );
                    }
                    if (
                      config.table === 'notice_deliveries' &&
                      field.key === 'recipient_name'
                    ) {
                      return (
                        <SelectInput
                          key={field.key}
                          label={field.label}
                          value={value}
                          required={field.required}
                          options={[
                            {
                              value: '',
                              label: 'Select Recipient Name',
                            },
                            ...shareholders.map(
                              (item: any) => ({
                                value: String(
                                  item.full_name ?? ''
                                ),
                                label: `${item.company_shareholder_id ?? '—'} - ${
                                  item.full_name ?? ''
                                }`,
                              })
                            ),
                          ]}
                          onChange={(event) =>
                            setGenericForm((old) => ({
                              ...old,
                              [field.key]:
                                event.target.value,
                            }))
                          }
                        />
                      );
                    }
                    if (
                      config.table === 'notice_deliveries' &&
                      field.key === 'delivery_method'
                    ) {
                      return (
                        <SelectInput
                          key={field.key}
                          label={field.label}
                          value={value}
                          required={field.required}
                          options={[
                            {
                              value: '',
                              label: 'Select Delivery Method',
                            },
                            {
                              value: 'App',
                              label: 'App',
                            },
                            {
                              value: 'SMS',
                              label: 'SMS',
                            },
                            {
                              value: 'Email',
                              label: 'Email',
                            },
                            {
                              value: 'Other',
                              label: 'Other',
                            },
                          ]}
                          onChange={(event) =>
                            setGenericForm((old) => ({
                              ...old,
                              [field.key]:
                                event.target.value,
                            }))
                          }
                        />
                      );
                    }
                    if (
                      config.table === 'notice_deliveries' &&
                      field.key === 'status'
                    ) {
                      return (
                        <SelectInput
                          key={field.key}
                          label={field.label}
                          value={value}
                          required={field.required}
                          options={[
                            {
                              value: '',
                              label: 'Select Status',
                            },
                            {
                              value: 'pending',
                              label: 'Pending',
                            },
                            {
                              value: 'sent',
                              label: 'Sent',
                            },
                            {
                              value: 'delivered',
                              label: 'Delivered',
                            },
                            {
                              value: 'failed',
                              label: 'Failed',
                            },
                          ]}
                          onChange={(event) =>
                            setGenericForm((old) => ({
                              ...old,
                              [field.key]:
                                event.target.value,
                            }))
                          }
                        />
                      );
                    }
  
                  if (
                    isShareholderDividends &&
                    field.key ===
                      'dividend_id'
                  ) {
                    return (
                      <SelectInput
                        key={
                          field.key
                        }
                        label={
                          field.label
                        }
                        value={value}
                        required={
                          field.required ??
                          true
                        }
                        options={[
                          {
                            value: '',
                            label:
                              'Select Dividend',
                          },
                          ...(rows.dividends ??
                            []).map(
                            (
                              item: any
                            ) => ({
                              value:
                                String(
                                  item.id
                                ),
                              label: `${item.dividend_year ?? '—'} - ${
                                item.dividend_rate ?? 0
                              } per share`,
                            })
                          ),
                        ]}
                        onChange={(
                          event
                        ) =>
                          setGenericForm(
                            (old) => ({
                              ...old,
                              [field.key]:
                                event
                                  .target
                                  .value,
                            })
                          )
                        }
                      />
                    );
                  }
  
                  if (
                    isShareholderDividends &&
                    field.key ===
                      'shareholder_id'
                  ) {
                    return (
                      <SelectInput
                        key={
                          field.key
                        }
                        label={
                          field.label
                        }
                        value={value}
                        required={
                          field.required ??
                          true
                        }
                        options={[
                          {
                            value: '',
                            label:
                              'Select Shareholder',
                          },
                          ...shareholders.map(
                            (item) => ({
                              value:
                                String(
                                  item.id
                                ),
                              label: `${item.company_shareholder_id ?? '—'} - ${
                                item.full_name ??
                                ''
                              }`,
                            })
                          ),
                        ]}
                        onChange={(
                          event
                        ) =>
                          setGenericForm(
                            (old) => ({
                              ...old,
                              [field.key]:
                                event
                                  .target
                                  .value,
                            })
                          )
                        }
                      />
                    );
                  }
  
                  if (
                    field.type ===
                    'textarea'
                  ) {
                    return (
                      <div
                        key={
                          field.key
                        }
                        className="md:col-span-2"
                      >
                        <TextArea
                          label={
                            field.label
                          }
                          value={
                            value
                          }
                          required={
                            field.required
                          }
                          onChange={(
                            event
                          ) =>
                            setGenericForm(
                              (old) => ({
                                ...old,
                                [field.key]:
                                  event
                                    .target
                                    .value,
                              })
                            )
                          }
                        />
                      </div>
                    );
                  }
  
                  if (
                    field.type ===
                    'select'
                  ) {
                    return (
                      <SelectInput
                        key={
                          field.key
                        }
                        label={
                          field.label
                        }
                        value={
                          value
                        }
                        required={
                          field.required
                        }
                        options={
                          field.options ??
                          []
                        }
                        onChange={(
                          event
                        ) =>
                          setGenericForm(
                            (old) => ({
                              ...old,
                              [field.key]:
                                event
                                  .target
                                  .value,
                            })
                          )
                        }
                      />
                    );
                  }
  
                  return (
                    <Input
                      key={
                        field.key
                      }
                      label={
                        field.label
                      }
                      type={
                        field.type
                      }
                      value={
                        value
                      }
                      required={
                        field.required
                      }
                      onChange={(
                        event
                      ) =>
                        setGenericForm(
                          (old) => ({
                            ...old,
                            [field.key]:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                    />
                  );
                }
              )}
            </div>
  
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                onClick={() => {
                  if (
                    config.table ===
                    'company_share_configuration'
                  ) {
                    saveCompanyShareConfiguration();
                  } else {
                    saveGenericRow(
                      config.table,
                      genericForm
                    );
                  }
                }}
              >
                Save
              </button>
  
              <button
                className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700"
                onClick={
                  cancelGenericEdit
                }
              >
                Cancel
              </button>
            </div>
          </div>
        )}
  
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {data.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-4xl">
                📭
              </div>
  
              <p className="mt-3 font-semibold text-slate-700">
                No records found
              </p>
  
              <p className="mt-1 text-sm text-slate-500">
                There is no data available for this section.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {displayKeys.map(
                      (key) => (
                        <th
                          key={key}
                          className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-600"
                        >
                          {isBooking &&
                          key ===
                            'customer_id'
                            ? 'Customer ID'
                            : isBooking &&
                              key ===
                                'property_id'
                            ? 'Property ID'
                            : isBooking &&
                              key ===
                                'booking_date'
                            ? 'Booking Date'
                            : isBooking &&
                              key ===
                                'booking_amount'
                            ? 'Booking Amount'
                            : isBooking &&
                              key ===
                                'paid_amount'
                            ? 'Paid Amount'
                            : isBooking &&
                              key ===
                                'due_amount'
                            ? 'Due Amount'
                            : isBooking &&
                              key ===
                                'status'
                            ? 'Status'
                            : isShareholderDividends &&
                              key ===
                                'dividend_id'
                            ? 'Dividend'
                            : isShareholderDividends &&
                              key ===
                                'shareholder_id'
                            ? 'Shareholder'
                            : isShareholderDividends &&
                              key ===
                                'share_quantity'
                            ? 'Shares'
                            : isShareholderDividends &&
                              key ===
                                'dividend_amount'
                            ? 'Dividend Amount'
                            : isShareholderDividends &&
                              key ===
                                'paid_amount'
                            ? 'Paid Amount'
                            : isShareholderDividends &&
                              key ===
                                'due_amount'
                            ? 'Due Amount'
                            : isShareholderDividends &&
                              key ===
                                'status'
                            ? 'Status'
                            : key.replace(
                                /_/g,
                                ' '
                              )}
                        </th>
                      )
                    )}
  
                    {currentUserRole !==
                      'Shareholder' &&
                      currentUserRole !==
                        'Visitor' && (
                        <th className="px-4 py-3 text-left font-semibold text-slate-600">
                          Actions
                        </th>
                      )}
                  </tr>
                </thead>
  
                <tbody className="divide-y divide-slate-100">
                  {data.map(
                    (
                      row,
                      index
                    ) => (
                      <tr
                        key={
                          row.id ??
                          `${config.table}-${index}`
                        }
                        className="hover:bg-slate-50"
                      >
                        {displayKeys.map(
                          (key) => {
                            const bookingPaidAmount =
                              isBooking
                                ? getBookingPaymentSummary(
                                    row.id
                                  )
                                : 0;
  
                            const bookingAmount =
                              isBooking
                                ? Number(
                                    row.booking_amount ??
                                      0
                                  )
                                : 0;
  
                            const bookingDueAmount =
                              isBooking
                                ? Math.max(
                                    bookingAmount -
                                      bookingPaidAmount,
                                    0
                                  )
                                : 0;
  
                            let displayValue: any =
                              row[
                                key
                              ];
  
                            if (
                              isBooking &&
                              key ===
                                'paid_amount'
                            ) {
                              displayValue =
                                bookingPaidAmount;
                            }
  
                            if (
                              isBooking &&
                              key ===
                                'due_amount'
                            ) {
                              displayValue =
                                bookingDueAmount;
                            }
  
                            return (
                              <td
                                key={
                                  key
                                }
                                className="whitespace-nowrap px-4 py-3 text-slate-700"
                              >
                                {isShareholderDividends &&
                                key ===
                                  'shareholder_id'
                                  ? getShareholderName(
                                      row[
                                        key
                                      ]
                                    )
                                  : isShareholderDividends &&
                                    key ===
                                      'dividend_id'
                                  ? getDividendLabel(
                                      row[
                                        key
                                      ]
                                    )
                                  : (
                                      isShareholderDividends &&
                                      (
                                        key ===
                                          'dividend_amount' ||
                                        key ===
                                          'paid_amount' ||
                                        key ===
                                          'due_amount'
                                      )
                                    ) ||
                                    (
                                      isBooking &&
                                      (
                                        key ===
                                          'booking_amount' ||
                                        key ===
                                          'paid_amount' ||
                                        key ===
                                          'due_amount'
                                      )
                                    )
                                  ? formatMoney(
                                      Number(
                                        displayValue ??
                                          0
                                      )
                                    )
                                  : String(
                                      displayValue ??
                                        ''
                                    )}
                              </td>
                            );
                          }
                        )}
  
                        {currentUserRole !==
                          'Shareholder' &&
                          currentUserRole !==
                            'Visitor' && (
                            <td className="whitespace-nowrap px-4 py-3">
                              <div className="flex flex-wrap gap-2">
                                {isShareholderDividends &&
                                  currentUserRole ===
                                    'Accountant' &&
                                  Number(
                                    row.due_amount ??
                                      0
                                  ) > 0 &&
                                  (() => {
                                    const request =
                                      (
                                        rows.dividend_payment_requests ??
                                        []
                                      ).find(
                                        (
                                          item: any
                                        ) =>
                                          String(
                                            item.shareholder_dividend_id ??
                                              ''
                                          ) ===
                                          String(
                                            row.id ??
                                              ''
                                          )
                                      );
  
                                    if (
                                      !request
                                    ) {
                                      return (
                                        <button
                                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                                          onClick={() =>
                                            createDividendPaymentRequest(
                                              row
                                            )
                                          }
                                        >
                                          Create Payment Request
                                        </button>
                                      );
                                    }
  
                                    const requestStatus =
                                      String(
                                        request.status ??
                                          ''
                                      ).toLowerCase();
  
                                    if (
                                      requestStatus ===
                                      'pending'
                                    ) {
                                      return (
                                        <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                                          Payment Request Done
                                        </span>
                                      );
                                    }
  
                                    if (
                                      requestStatus ===
                                      'approved'
                                    ) {
                                      return (
                                        <button
                                          className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100"
                                          onClick={() =>
                                            makeDividendPayment(
                                              row
                                            )
                                          }
                                        >
                                          Make Payment
                                        </button>
                                      );
                                    }
  
                                    if (
                                      requestStatus ===
                                      'paid'
                                    ) {
                                      return (
                                        <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                                          Payment Done
                                        </span>
                                      );
                                    }
  
                                    return null;
                                  })()}
  
                                {config.table !==
                                  'shareholder_payments' &&
                                  !isShareholderDividends &&
                                  currentUserRole !==
                                    'Accountant' &&
                                  (
                                    rows.permissions ??
                                    []
                                  ).some(
                                    (
                                      permission: any
                                    ) =>
                                      String(
                                        permission.role ??
                                          ''
                                      )
                                        .trim()
                                        .toLowerCase() ===
                                        currentUserRole.toLowerCase() &&
                                      String(
                                        permission.module ??
                                          ''
                                      )
                                        .trim()
                                        .toLowerCase() ===
                                        String(
                                          permissionModule ??
                                            ''
                                        )
                                          .trim()
                                          .toLowerCase() &&
                                      permission.can_edit ===
                                        true
                                  ) && (
                                    <button
                                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold hover:bg-slate-200"
                                      onClick={() =>
                                        startEditRow(
                                          config.table,
                                          row
                                        )
                                      }
                                    >
                                      Edit
                                    </button>
                                  )}
  
                                {config.table ===
                                  'shareholder_payments' &&
                                  currentUserRole ===
                                    'Accountant' &&
                                  String(
                                    row.status ??
                                      ''
                                  ).toLowerCase() ===
                                    'pending' && (
                                    <button
                                      className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600 hover:bg-green-100"
                                      onClick={() =>
                                        markShareholderPaymentDone(
                                          row
                                        )
                                      }
                                    >
                                      Mark as Done
                                    </button>
                                  )}
  
                                {config.table ===
                                  'shareholder_payments' &&
                                  String(
                                    row.status ??
                                      ''
                                  ).toLowerCase() ===
                                    'done' && (
                                    <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                                      Paid
                                    </span>
                                  )}
  
                                {config.table !==
                                  'shareholder_payments' &&
                                  !isShareholderDividends &&
                                  currentUserRole !==
                                    'Accountant' &&
                                  (
                                    rows.permissions ??
                                    []
                                  ).some(
                                    (
                                      permission: any
                                    ) =>
                                      String(
                                        permission.role ??
                                          ''
                                      )
                                        .trim()
                                        .toLowerCase() ===
                                        currentUserRole.toLowerCase() &&
                                      String(
                                        permission.module ??
                                          ''
                                      )
                                        .trim()
                                        .toLowerCase() ===
                                        String(
                                          permissionModule ??
                                            ''
                                        )
                                          .trim()
                                          .toLowerCase() &&
                                      permission.can_delete ===
                                        true
                                  ) && (
                                    <button
                                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                                      onClick={() =>
                                        deleteGenericRow(
                                          config.table,
                                          row
                                        )
                                      }
                                    >
                                      Delete
                                    </button>
                                  )}
                              </div>
                            </td>
                          )}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    const totalShares = Number(
      shareConfig?.total_share ?? 10000
    );

    const sharePrice = Number(
      shareConfig?.share_price ?? 20000
    );

    const allocatedShares =
      Number(
        dashboardSummary.allocated_shares
      ) ||
      shareholders.reduce(
        (sum, item) =>
          sum + Number(item.share_quantity ?? 0),
        0
      );

    const remainingShares = Math.max(
      totalShares - allocatedShares,
      0
    );

    const totalCapital =
      totalShares * sharePrice;

    const allocatedValue =
      allocatedShares * sharePrice;

    const projectCount =
      rows.project?.length ?? 0;

    const propertyCount =
      rows.properties?.length ?? 0;

    const bookingCount =
      rows.booking?.length ?? 0;

    const paymentCount =
      rows.payments?.length ?? 0;

    const dividendCount =
      rows.dividend?.length ?? 0;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome to Our Real Estate Company Ltd
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Shareholder and company management dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Shareholders"
            value={
              dashboardSummary.total_shareholders
            }
            icon="👥"
          />

          <StatCard
            title="Total Shares"
            value={totalShares.toLocaleString()}
            icon="📊"
          />

          <StatCard
            title="Allocated Shares"
            value={allocatedShares.toLocaleString()}
            icon="📌"
          />

          <StatCard
            title="Remaining Shares"
            value={remainingShares.toLocaleString()}
            icon="🟢"
          />

          <StatCard
            title="Share Price"
            value={formatMoney(sharePrice)}
            icon="💰"
          />

          <StatCard
            title="Total Share Capital"
            value={formatMoney(totalCapital)}
            icon="🏦"
          />

          <StatCard
            title="Allocated Value"
            value={formatMoney(allocatedValue)}
            icon="📈"
          />

          <StatCard
            title="Projects"
            value={projectCount}
            icon="🏗️"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard
            title="Properties"
            value={propertyCount}
            icon="🏠"
          />

          <StatCard
            title="Bookings"
            value={bookingCount}
            icon="📅"
          />

          <StatCard
            title="Payments"
            value={paymentCount}
            icon="💳"
          />

          <StatCard
            title="Dividends"
            value={dividendCount}
            icon="🪙"
          />
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <h3 className="font-bold text-blue-900">
            Account Information
          </h3>

          <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <div>
              <span className="text-blue-700">
                Logged in as
              </span>

              <p className="font-semibold text-blue-950">
                {session?.user?.email ?? ''}
              </p>
            </div>

            <div>
              <span className="text-blue-700">
                Role
              </span>

              <p className="font-semibold text-blue-950">
                {currentUserRole}
              </p>
            </div>

            <div>
              <span className="text-blue-700">
                Status
              </span>

              <p className="font-semibold text-green-700">
                Active
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderShareholders = () => {
    console.log('RENDER SHAREHOLDERS');
    console.log('SHAREHOLDER FORM:', shareholderForm);
  
    const canManage =
      currentUserRole === 'Admin' ||
      currentUserRole === 'Manager' ||
      currentUserRole === 'Employee' ||
      currentUserRole === 'Accountant';
  
    const shareholderRows =
      currentUserRole === 'Shareholder'
        ? shareholders.filter(
            (item) =>
              String(item.user_id ?? '') ===
              String(currentUserId)
          )
        : shareholders;
  
    /*
     * IMPORTANT:
     * Share quantity and share value come from
     * shareholder_shares.
     *
     * The shareholders table is only used for
     * shareholder profile/master information.
     */
    const getShareholderShareRecords = (
      shareholderId: any
    ) => {
      return shareholderShares.filter(
        (share) =>
          String(share.shareholder_id ?? '') ===
          String(shareholderId ?? '')
      );
    };
  
    const getShareholderShareSummary = (
      shareholderId: any
    ) => {
      const records =
        getShareholderShareRecords(
          shareholderId
        );
  
      const activeRecords = records.filter(
        (share) =>
          String(
            share.status ?? 'active'
          ).toLowerCase() === 'active'
      );
  
      const quantity = activeRecords.reduce(
        (total, share) => {
          const value = Number(
            share.quantity ?? 1
          );
  
          return (
            total +
            (Number.isFinite(value)
              ? value
              : 0)
          );
        },
        0
      );
  
      const totalValue =
        activeRecords.reduce(
          (total, share) => {
            const quantityValue = Number(
              share.quantity ?? 1
            );
  
            const priceValue = Number(
              share.share_price ?? 0
            );
  
            const calculatedValue =
              Number(
                share.total_value ?? 0
              );
  
            const value =
              Number.isFinite(
                calculatedValue
              ) &&
              calculatedValue > 0
                ? calculatedValue
                : (Number.isFinite(
                    quantityValue
                  )
                    ? quantityValue
                    : 0) *
                  (Number.isFinite(
                    priceValue
                  )
                    ? priceValue
                    : 0);
  
            return total + value;
          },
          0
        );
  
      const companyShareIds =
        activeRecords
          .map(
            (share) =>
              share.company_share_id
          )
          .filter(
            (value) =>
              value !== null &&
              value !== undefined &&
              String(value).trim() !== ''
          )
          .map((value) =>
            String(value)
          );
  
      return {
        records,
        activeRecords,
        quantity,
        totalValue,
        companyShareIds,
      };
    };
  
    /*
     * When an existing shareholder is opened,
     * shareholder profile data comes from the
     * shareholders table.
     *
     * Current share information comes from
     * shareholder_shares and is read-only here.
     */
    const selectedShareholderId =
      selectedShareholder?.id ??
      shareholderForm.id ??
      null;
  
    const selectedShareSummary =
      selectedShareholderId
        ? getShareholderShareSummary(
            selectedShareholderId
          )
        : null;
  
    const selectedShareQuantity =
      selectedShareSummary?.quantity ?? 0;
  
    const selectedShareValue =
      selectedShareSummary?.totalValue ?? 0;
  
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Shareholders
            </h2>
  
            <p className="mt-1 text-sm text-slate-500">
              Manage company shareholder information.
            </p>
          </div>
  
          {canManage && (
            <button
              className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
              onClick={openNewShareholder}
            >
              + Add Shareholder
            </button>
          )}
        </div>
  
        {showShareholderForm && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {selectedShareholder
                  ? 'Edit / View Shareholder'
                  : 'Add Shareholder'}
              </h3>
  
              <button
                className="rounded-lg border px-3 py-2 text-sm"
                onClick={resetShareholderForm}
              >
                Close
              </button>
            </div>
  
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Company Shareholder ID */}
              <Input
                label="Company Shareholder ID"
                type="number"
                required
                value={
                  shareholderForm.company_shareholder_id
                }
                disabled={
                  !canManage ||
                  !!selectedShareholder
                }
                onChange={(event) =>
                  setShareholderForm((old) => ({
                    ...old,
                    company_shareholder_id:
                      event.target.value,
                  }))
                }
              />
  
              {/* Supabase User ID */}
              <Input
                label="Supabase User ID"
                value={
                  shareholderForm.user_id
                }
                disabled
              />
  
              {/* Full Name */}
              <Input
                label="Full Name"
                required
                value={
                  shareholderForm.full_name
                }
                disabled={!canManage}
                onChange={(event) =>
                  setShareholderForm((old) => ({
                    ...old,
                    full_name:
                      event.target.value,
                  }))
                }
              />
  
              {/* Email */}
              <Input
                label="Email"
                type="email"
                value={
                  shareholderForm.email
                }
                disabled={!canManage}
                onChange={(event) =>
                  setShareholderForm((old) => ({
                    ...old,
                    email:
                      event.target.value,
                  }))
                }
              />
  
              {/* Shareholder Login Account */}
              <div className="md:col-span-2 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="mb-3">
                  <div className="font-semibold text-blue-900">
                    Shareholder Login Account
                  </div>
  
                  <div className="text-sm text-blue-700">
                    Create or update the login account for this shareholder.
                  </div>
                </div>
  
                <button
                  type="button"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  onClick={
                    createShareholderAccount
                  }
                  disabled={
                    creatingShareholderAccount ||
                    !shareholderForm.full_name ||
                    !shareholderForm.email
                  }
                >
                  {creatingShareholderAccount
                    ? 'Processing...'
                    : shareholderForm.user_id
                      ? 'Update Login Email'
                      : 'Create Login Account'}
                </button>
              </div>
  
              {/* Phone Number */}
              <Input
                label="Phone Number"
                value={
                  shareholderForm.phone_number
                }
                disabled={!canManage}
                onChange={(event) =>
                  setShareholderForm((old) => ({
                    ...old,
                    phone_number:
                      event.target.value,
                  }))
                }
              />
  
              {/* National ID */}
              <Input
                label="National ID"
                value={
                  shareholderForm.national_id
                }
                disabled={
                  !canManage ||
                  !!selectedShareholder
                }
                onChange={(event) =>
                  setShareholderForm((old) => ({
                    ...old,
                    national_id:
                      event.target.value,
                  }))
                }
              />
  
              {/* Profession */}
              <Input
                label="Profession"
                value={
                  shareholderForm.profession
                }
                disabled={!canManage}
                onChange={(event) =>
                  setShareholderForm((old) => ({
                    ...old,
                    profession:
                      event.target.value,
                  }))
                }
              />
  
              {/* Current Share Quantity */}
              {selectedShareholder && (
                <>
                  <Input
                    label="Current Share Quantity"
                    type="number"
                    value={String(
                      selectedShareQuantity
                    )}
                    disabled
                  />
  
                  {/* Current Total Share Value */}
                  <Input
                    label="Current Total Share Value"
                    value={formatMoney(
                      selectedShareValue
                    )}
                    disabled
                  />
                </>
              )}
  
              {/* Join Date */}
              <Input
                label="Join Date"
                type="date"
                value={
                  shareholderForm.join_date
                }
                disabled={!canManage}
                onChange={(event) =>
                  setShareholderForm((old) => ({
                    ...old,
                    join_date:
                      event.target.value,
                  }))
                }
              />
  
              {/* Address */}
              <div className="md:col-span-2">
                <TextArea
                  label="Address"
                  value={
                    shareholderForm.address
                  }
                  disabled={!canManage}
                  onChange={(event) =>
                    setShareholderForm((old) => ({
                      ...old,
                      address:
                        event.target.value,
                    }))
                  }
                />
              </div>
  
              {/* Note */}
              <div className="md:col-span-2">
                <TextArea
                  label="Note"
                  value={
                    shareholderForm.note
                  }
                  disabled={!canManage}
                  onChange={(event) =>
                    setShareholderForm((old) => ({
                      ...old,
                      note:
                        event.target.value,
                    }))
                  }
                />
              </div>
            </div>
  
            {canManage && (
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                  onClick={
                    saveShareholder
                  }
                >
                  Save Shareholder
                </button>
  
                <button
                  className="rounded-xl border px-5 py-2.5 font-semibold"
                  onClick={
                    resetShareholderForm
                  }
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
  
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {shareholderRows.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No shareholders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      Shareholder ID
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      Name
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      Email
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      Phone
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      Shares
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      Share Value
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      Due
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
  
                <tbody className="divide-y divide-slate-100">
                  {shareholderRows.map(
                    (item, index) => {
                      const summary =
                        getShareholderShareSummary(
                          item.id
                        );
  
                      return (
                        <tr
                          key={
                            item.id ??
                            `shareholder-${index}`
                          }
                          className="hover:bg-slate-50"
                        >
                          <td className="px-4 py-3 font-semibold text-blue-700">
                            {item.company_shareholder_id ??
                              '—'}
                          </td>
  
                          <td className="px-4 py-3 font-medium">
                            {item.full_name ?? '—'}
                          </td>
  
                          <td className="px-4 py-3">
                            {item.email ?? '—'}
                          </td>
  
                          <td className="px-4 py-3">
                            {item.phone_number ?? '—'}
                          </td>
  
                          <td className="px-4 py-3">
                            {Number(
                              summary.quantity
                            ).toLocaleString()}
                          </td>
  
                          <td className="px-4 py-3">
                            {formatMoney(
                              summary.totalValue
                            )}
                          </td>
  
                          <td className="px-4 py-3">
                            {formatMoney(
                              item.due_amount
                            )}
                          </td>
  
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold"
                                onClick={() =>
                                  openShareholderForView(
                                    item
                                  )
                                }
                              >
                                View
                              </button>
  
                              {canManage && (
                                <>
                                  <button
                                    className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                                    onClick={() =>
                                      openShareholderForEdit(
                                        item
                                      )
                                    }
                                  >
                                    Edit
                                  </button>
  
                                  <button
                                    className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600"
                                    onClick={() =>
                                      deleteShareholder(
                                        item
                                      )
                                    }
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderShares = () => {
    const totalShares = Number(
      shareConfig?.total_share ?? 10000
    );

    const sharePrice = Number(
      shareConfig?.share_price ?? 20000
    );

    const allocatedShares =
      Number(
        dashboardSummary.allocated_shares
      ) ||
      shareholders.reduce(
        (sum, item) =>
          sum + Number(item.share_quantity ?? 0),
        0
      );

    const remaining =
      Math.max(
        totalShares - allocatedShares,
        0
      );

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            Shares
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Company share overview.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Shares"
            value={totalShares.toLocaleString()}
            icon="📊"
          />

          <StatCard
            title="Allocated"
            value={allocatedShares.toLocaleString()}
            icon="📌"
          />

          <StatCard
            title="Remaining"
            value={remaining.toLocaleString()}
            icon="🟢"
          />

          <StatCard
            title="Share Price"
            value={formatMoney(sharePrice)}
            icon="💰"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold">
            Share Capital
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Total Capital
              </p>
              <p className="mt-1 text-xl font-bold">
                {formatMoney(
                  totalShares * sharePrice
                )}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Allocated Value
              </p>
              <p className="mt-1 text-xl font-bold">
                {formatMoney(
                  allocatedShares *
                    sharePrice
                )}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Remaining Value
              </p>
              <p className="mt-1 text-xl font-bold">
                {formatMoney(
                  remaining * sharePrice
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderShareholderShare = () => {
    const canManage =
      currentUserRole === 'Admin' ||
      currentUserRole === 'Manager' ||
      currentUserRole === 'Employee' ||
      currentUserRole === 'Accountant';

    const visibleShares =
      currentUserRole === 'Shareholder'
        ? shareholderShares.filter(
            (item) =>
              String(
                item.shareholder_id
              ) ===
              String(
                currentShareholder?.id
              )
          )
        : shareholderShares;

    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">
              Shareholder Share
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Individual company share allocation records.
            </p>
          </div>

          {canManage && (
            <button
              className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
              onClick={openNewShareholderShare}
            >
              + Add Share
            </button>
          )}
        </div>

        {showShareholderShareForm &&
          canManage && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  {editingShareholderShare
                    ? 'Edit Share'
                    : 'Add Share'}
                </h3>

                <button
                  className="rounded-lg border px-3 py-2 text-sm"
                  onClick={
                    resetShareholderShareForm
                  }
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectInput
  label="Shareholder"
  required
  value={shareholderShareForm.shareholder_id}
  options={shareholders.map((item) => ({
    value: String(item.id),
    label: `${item.company_shareholder_id ?? '—'} - ${item.full_name ?? ''}`,
  }))}
  onChange={(event) =>
    setShareholderShareForm((old) => ({
      ...old,
      shareholder_id: event.target.value,
    }))
  }
/>

                <SelectInput
                  label="Share Type"
                  required
                  value={
                    shareholderShareForm.share_type_id
                  }
                  options={[
                    { value: 1, label: 'সাধারণ শেয়ার' },
                    { value: 2, label: 'দীর্ঘমেয়াদী শেয়ার' },
                    { value: 3, label: 'স্থায়ী শেয়ার' },
                  ]}
                  onChange={(event) =>
                    setShareholderShareForm(
                      (old) => ({
                        ...old,
                        share_type_id:
                          event.target.value,
                      })
                    )
                  }
                />

<Input
  label="Company Share ID"
  type="text"
  required
  placeholder="950, 980, 600, 850"
  value={
    shareholderShareForm.company_share_id
  }
  onChange={(event) => {
    const value = event.target.value;

    const ids = value
      .split(/[\s,]+/)
      .map((item) => item.trim())
      .filter(Boolean);

    const validIds = ids.filter((item) =>
      /^\d+$/.test(item)
    );

    setShareholderShareForm((old) => ({
      ...old,
      company_share_id: value,
      quantity: String(validIds.length),
    }));
  }}
/>

<Input
  label="Quantity"
  type="number"
  required
  value={
    shareholderShareForm.quantity
  }
  disabled
  onChange={() => {}}
/>

                <Input
                  label="Share Price"
                  type="number"
                  required
                  value={
                    shareholderShareForm.share_price
                  }
                  onChange={(event) =>
                    setShareholderShareForm(
                      (old) => ({
                        ...old,
                        share_price:
                          event.target.value,
                      })
                    )
                  }
                />

                <Input
                  label="Start Date"
                  type="date"
                  value={
                    shareholderShareForm.start_date
                  }
                  onChange={(event) =>
                    setShareholderShareForm(
                      (old) => ({
                        ...old,
                        start_date:
                          event.target.value,
                      })
                    )
                  }
                />

                <Input
                  label="End Date"
                  type="date"
                  value={
                    shareholderShareForm.end_date
                  }
                  onChange={(event) =>
                    setShareholderShareForm(
                      (old) => ({
                        ...old,
                        end_date:
                          event.target.value,
                      })
                    )
                  }
                />

                <SelectInput
                  label="Status"
                  value={
                    shareholderShareForm.status
                  }
                  options={[
                    {
                      value: 'active',
                      label: 'Active',
                    },
                    {
                      value: 'inactive',
                      label: 'Inactive',
                    },
                    {
                      value: 'transferred',
                      label: 'Transferred',
                    },
                    {
                      value: 'closed',
                      label: 'Closed',
                    },
                  ]}
                  onChange={(event) =>
                    setShareholderShareForm(
                      (old) => ({
                        ...old,
                        status:
                          event.target.value,
                      })
                    )
                  }
                />

                <div className="md:col-span-2">
                  <TextArea
                    label="Notes"
                    value={
                      shareholderShareForm.notes
                    }
                    onChange={(event) =>
                      setShareholderShareForm(
                        (old) => ({
                          ...old,
                          notes:
                            event.target.value,
                        })
                      )
                    }
                  />
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                  onClick={
                    saveShareholderShare
                  }
                >
                  Save Share
                </button>

                <button
                  className="rounded-xl border px-5 py-2.5 font-semibold"
                  onClick={
                    resetShareholderShareForm
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {visibleShares.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No shareholder shares found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      Share ID
                    </th>

                    <th className="px-4 py-3 text-left">
                      Shareholder
                    </th>

                    <th className="px-4 py-3 text-left">
                      Type
                    </th>

                    <th className="px-4 py-3 text-left">
                      Quantity
                    </th>

                    <th className="px-4 py-3 text-left">
                      Price
                    </th>

                    <th className="px-4 py-3 text-left">
                      Total Value
                    </th>

                    <th className="px-4 py-3 text-left">
                      Status
                    </th>

                    {canManage && (
                      <th className="px-4 py-3 text-left">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {visibleShares.map(
                    (item, index) => {
                      const shareholder =
                        shareholders.find(
                          (person) =>
                            String(
                              person.id
                            ) ===
                            String(
                              item.shareholder_id
                            )
                        );

                      const shareType =
                        shareTypes.find(
                          (type) =>
                            String(
                              type.id
                            ) ===
                            String(
                              item.share_type_id
                            )
                        );

                      return (
                        <tr
                          key={
                            item.id ??
                            `share-${index}`
                          }
                        >
                          <td className="px-4 py-3 font-semibold text-blue-700">
                            {item.company_share_id ??
                              '—'}
                          </td>

                          <td className="px-4 py-3">
                            {shareholder?.full_name ??
                              '—'}
                          </td>

                          <td className="px-4 py-3">
                            {shareType?.name ??
                              item.share_type_id ??
                              '—'}
                          </td>

                          <td className="px-4 py-3">
                            {Number(
                              item.quantity ?? 0
                            ).toLocaleString()}
                          </td>

                          <td className="px-4 py-3">
                            {formatMoney(
                              item.share_price
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {formatMoney(
                              item.total_value
                            )}
                          </td>

                          <td className="px-4 py-3">
                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                              {item.status ??
                                'active'}
                            </span>
                          </td>

                          {canManage && (
  <td className="px-4 py-3">
    <div className="flex gap-2">
      {String(item.status ?? '')
        .trim()
        .toLowerCase() === 'active' && (
        <>
          <button
            className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
            onClick={() =>
              openShareholderShareForEdit(
                item
              )
            }
          >
            Edit
          </button>

          <button
            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600"
            onClick={() =>
              deleteShareholderShare(
                item
              )
            }
          >
            Delete
          </button>
        </>
      )}
    </div>
  </td>
)}
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };
  const renderShareSettings = () => {
    const canManage =
      currentUserRole === 'Admin' ||
      currentUserRole === 'Manager';

    const configRows =
      rows.company_share_configuration ?? [];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            Share Settings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Configure company shares and share types.
          </p>
        </div>

        {canManage && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold">
              Company Share Configuration
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                label="Total Share"
                type="number"
                value={
                  genericForm.total_share ??
                  shareConfig?.total_share ??
                  ''
                }
                onChange={(event) =>
                  setGenericForm((old) => ({
                    ...old,
                    total_share:
                      event.target.value,
                  }))
                }
              />

              <Input
                label="Share Price"
                type="number"
                value={
                  genericForm.share_price ??
                  shareConfig?.share_price ??
                  ''
                }
                onChange={(event) =>
                  setGenericForm((old) => ({
                    ...old,
                    share_price:
                      event.target.value,
                  }))
                }
              />

              <Input
                label="Currency"
                value={
                  genericForm.currency ??
                  shareConfig?.currency ??
                  'BDT'
                }
                onChange={(event) =>
                  setGenericForm((old) => ({
                    ...old,
                    currency:
                      event.target.value,
                  }))
                }
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                onClick={() => {
                  setEditing({
                    table:
                      'company_share_configuration',
                    row:
                      configRows[0] ?? {},
                  });

                  setGenericForm({
                    total_share:
                      configRows[0]?.total_share ??
                      shareConfig?.total_share ??
                      '',
                    share_price:
                      configRows[0]?.share_price ??
                      shareConfig?.share_price ??
                      '',
                    currency:
                      configRows[0]?.currency ??
                      shareConfig?.currency ??
                      'BDT',
                  });

                  saveCompanyShareConfiguration();
                }}
              >
                Save Configuration
              </button>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold">
                Share Types
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Current share types available in the system.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    ID
                  </th>

                  <th className="px-4 py-3 text-left">
                    Name
                  </th>

                  <th className="px-4 py-3 text-left">
                    Term
                  </th>

                  <th className="px-4 py-3 text-left">
                    Month
                  </th>

                  <th className="px-4 py-3 text-left">
                    Share Price
                  </th>

                  <th className="px-4 py-3 text-left">
                    Total Share
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {shareTypes.map((type) => (
                  <tr key={type.id}>
                    <td className="px-4 py-3 font-semibold">
                      {type.id}
                    </td>

                    <td className="px-4 py-3">
                      {type.name ?? '—'}
                    </td>

                    <td className="px-4 py-3">
                      {type.term ?? '—'}
                    </td>

                    <td className="px-4 py-3">
                      {type.month ?? '—'}
                    </td>

                    <td className="px-4 py-3">
                      {formatMoney(
                        type.share_price
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {Number(
                        type.total_share ?? 0
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}

                {shareTypes.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No share types found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderMyShareDetails = () => {
    const details =
      myShareDetails.length > 0
        ? myShareDetails
        : shareholderShares.filter(
            (item) =>
              String(
                item.shareholder_id
              ) ===
              String(
                currentShareholder?.id
              )
          );

    const totalQuantity =
      details.reduce(
        (sum, item) =>
          sum +
          Number(
            item.quantity ?? 0
          ),
        0
      );

    const totalValue =
      details.reduce(
        (sum, item) =>
          sum +
          Number(
            item.total_value ??
              Number(item.quantity ?? 0) *
                Number(
                  item.share_price ?? 0
                )
          ),
        0
      );

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            My Share Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your personal company share information.
          </p>
        </div>

        {currentShareholder && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-blue-700">
                  Shareholder ID
                </p>

                <p className="mt-1 text-xl font-bold text-blue-950">
                  {currentShareholder.company_shareholder_id ??
                    '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-blue-700">
                  Name
                </p>

                <p className="mt-1 font-bold text-blue-950">
                  {currentShareholder.full_name ??
                    '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-blue-700">
                  Email
                </p>

                <p className="mt-1 font-bold text-blue-950">
                  {currentShareholder.email ??
                    session?.user?.email ??
                    '—'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            title="Total Shares"
            value={totalQuantity.toLocaleString()}
            icon="📊"
          />

          <StatCard
            title="Total Share Value"
            value={formatMoney(totalValue)}
            icon="💰"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {details.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-4xl">📭</div>

              <p className="mt-3 font-semibold">
                No share details found.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your allocated shares will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      Company Share ID
                    </th>

                    <th className="px-4 py-3 text-left">
                      Quantity
                    </th>

                    <th className="px-4 py-3 text-left">
                      Share Price
                    </th>

                    <th className="px-4 py-3 text-left">
                      Total Value
                    </th>

                    <th className="px-4 py-3 text-left">
                      Start Date
                    </th>

                    <th className="px-4 py-3 text-left">
                      End Date
                    </th>

                    <th className="px-4 py-3 text-left">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {details.map(
                    (item, index) => (
                      <tr
                        key={
                          item.id ??
                          item.company_share_id ??
                          `my-share-${index}`
                        }
                      >
                        <td className="px-4 py-3 font-semibold text-blue-700">
                          {item.company_share_id ??
                            item.share_id ??
                            '—'}
                        </td>

                        <td className="px-4 py-3">
                          {Number(
                            item.quantity ?? 0
                          ).toLocaleString()}
                        </td>

                        <td className="px-4 py-3">
                          {formatMoney(
                            item.share_price
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {formatMoney(
                            item.total_value ??
                              Number(
                                item.quantity ??
                                  0
                              ) *
                                Number(
                                  item.share_price ??
                                    0
                                )
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {item.start_date ??
                            '—'}
                        </td>

                        <td className="px-4 py-3">
                          {item.end_date ??
                            '—'}
                        </td>

                        <td className="px-4 py-3">
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                            {item.status ??
                              'active'}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderShareTransfer = () => {
    const canSubmit =
      currentUserRole === 'Admin' ||
      currentUserRole === 'Manager' ||
      currentUserRole === 'Employee' ||
      currentUserRole === 'Shareholder';
  
    const canReview =
      currentUserRole === 'Admin' ||
      currentUserRole === 'Manager' ||
      currentUserRole === 'Accountant' ||
      currentUserRole === 'Employee';
  
    const applicant =
      getApplicantShareholder();
  
    const availableShares =
      getApplicantShares();
  
    const visibleTransfers =
      shareTransfers;
  
    const activeQuantity =
      availableShares.reduce(
        (sum, item) =>
          sum +
          Number(item.quantity ?? 0),
        0
      );
  
    const withdrawalPrice =
      Number(
        withdrawalSharePrice || 0
      ) ||
      Number(
        shareConfig?.share_price || 0
      );
  
    const withdrawalQuantity =
      Number(
        shareTransferQuantity || 0
      );
  
    const withdrawalAmount =
      withdrawalQuantity *
      withdrawalPrice;
  
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            Share Transfer
          </h2>
  
          <p className="mt-1 text-sm text-slate-500">
            Submit and review share transfer, withdrawal and closure requests.
          </p>
        </div>
  
        {canSubmit && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold">
              New Share Request
            </h3>
  
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectInput
                label="Request Type"
                value={
                  shareTransferRequestType
                }
                options={[
                  {
                    value: 'Share Transfer',
                    label: 'Share Transfer',
                  },
                  {
                    value: 'Share Withdrawal',
                    label: 'Share Withdrawal',
                  },
                  {
                    value: 'Share Closure',
                    label: 'Share Closure',
                  },
                ]}
                onChange={(event) =>
                  setShareTransferRequestType(
                    event.target.value as
                      | 'Share Transfer'
                      | 'Share Withdrawal'
                      | 'Share Closure'
                  )
                }
              />
  
              {currentUserRole ===
              'Shareholder' ? (
                <Input
                  label="Applicant Shareholder"
                  value={`${
                    applicant?.company_shareholder_id ??
                    '—'
                  } - ${
                    applicant?.full_name ??
                    ''
                  }`}
                  disabled
                  onChange={() => {}}
                />
              ) : (
                <SelectInput
                  label="Applicant Shareholder"
                  required
                  value={
                    shareTransferApplicant
                  }
                  options={shareholders.map(
                    (item) => ({
                      value:
                        item.company_shareholder_id,
                      label: `${
                        item.company_shareholder_id ??
                        '—'
                      } - ${
                        item.full_name ??
                        ''
                      }`,
                    })
                  )}
                  onChange={(event) => {
                    const value =
                      event.target.value;
  
                    setShareTransferApplicant(
                      value
                    );
  
                    setShareTransferFrom(
                      value
                    );
  
                    setShareTransferTo(
                      ''
                    );
  
                    setShareRequestItems([
                      {
                        share_id: '',
                        shareholder_share_id:
                          '',
                        quantity: '',
                        purchase_value:
                          '',
                      },
                    ]);
                  }}
                />
              )}
  
              {shareTransferRequestType ===
                'Share Transfer' && (
                <SelectInput
                  label="To Shareholder"
                  required
                  value={
                    shareTransferTo
                  }
                  options={shareholders
                    .filter(
                      (item) =>
                        String(item.id) !==
                        String(
                          applicant?.id
                        )
                    )
                    .map((item) => ({
                      value: item.id,
                      label: `${
                        item.company_shareholder_id ??
                        '—'
                      } - ${
                        item.full_name ??
                        ''
                      }`,
                    }))}
                  onChange={(event) =>
                    setShareTransferTo(
                      event.target.value
                    )
                  }
                />
              )}
  
              <Input
                label={
                  shareTransferRequestType ===
                  'Share Transfer'
                    ? 'Transfer Date'
                    : shareTransferRequestType ===
                      'Share Withdrawal'
                    ? 'Withdrawal Date'
                    : 'Closure Date'
                }
                type="date"
                value={
                  shareTransferDate
                }
                onChange={(event) =>
                  setShareTransferDate(
                    event.target.value
                  )
                }
              />
  
              {shareTransferRequestType ===
                'Share Withdrawal' && (
                <>
                  <Input
                    label="Available Shares"
                    type="number"
                    value={
                      withdrawalAvailableQuantity ||
                      activeQuantity
                    }
                    onChange={(event) =>
                      setWithdrawalAvailableQuantity(
                        event.target.value
                      )
                    }
                  />
  
                  <Input
                    label="Withdrawal Quantity"
                    type="number"
                    value={
                      shareTransferQuantity
                    }
                    onChange={(event) =>
                      setShareTransferQuantity(
                        event.target.value
                      )
                    }
                  />
  
                  <Input
                    label="Share Price"
                    type="number"
                    value={
                      withdrawalSharePrice ||
                      shareConfig?.share_price ||
                      ''
                    }
                    onChange={(event) =>
                      setWithdrawalSharePrice(
                        event.target.value
                      )
                    }
                  />
  
                  <Input
                    label="Total Withdrawal Amount"
                    value={formatMoney(
                      withdrawalAmount
                    )}
                    disabled
                    onChange={() => {}}
                  />
  
                  <Input
                    label="Beneficiary Name"
                    value={
                      withdrawalBeneficiaryName
                    }
                    onChange={(event) =>
                      setWithdrawalBeneficiaryName(
                        event.target.value
                      )
                    }
                  />
  
                  <Input
                    label="Beneficiary Account / Mobile"
                    value={
                      withdrawalBeneficiaryAccount
                    }
                    onChange={(event) =>
                      setWithdrawalBeneficiaryAccount(
                        event.target.value
                      )
                    }
                  />
  
                  <SelectInput
                    label="Payment Method"
                    value={
                      withdrawalPaymentMethod
                    }
                    options={[
                      {
                        value:
                          'Bank Transfer',
                        label:
                          'Bank Transfer',
                      },
                      {
                        value:
                          'Mobile Banking',
                        label:
                          'Mobile Banking',
                      },
                      {
                        value: 'Cash',
                        label: 'Cash',
                      },
                    ]}
                    onChange={(event) =>
                      setWithdrawalPaymentMethod(
                        event.target.value
                      )
                    }
                  />
                </>
              )}
  
              {shareTransferRequestType ===
                'Share Closure' && (
                <>
                  <Input
                    label="Total Active Shares"
                    value={
                      activeQuantity
                    }
                    disabled
                    onChange={() => {}}
                  />
  
                  <Input
                    label="Share Price"
                    value={formatMoney(
                      withdrawalPrice
                    )}
                    disabled
                    onChange={() => {}}
                  />
  
                  <Input
                    label="Total Share Value"
                    value={formatMoney(
                      activeQuantity *
                        withdrawalPrice
                    )}
                    disabled
                    onChange={() => {}}
                  />
  
                  <Input
                    label="Closure Quantity"
                    type="number"
                    value={
                      shareTransferQuantity
                    }
                    onChange={(event) =>
                      setShareTransferQuantity(
                        event.target.value
                      )
                    }
                  />
                </>
              )}
            </div>
  
            {shareTransferRequestType ===
              'Share Transfer' && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-bold">
                    Select Shares
                  </h4>
  
                  <button
                    className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                    onClick={
                      addTransferItem
                    }
                  >
                    + Add Share
                  </button>
                </div>
  
                <div className="space-y-3">
                  {shareRequestItems.map(
                    (
                      item,
                      index
                    ) => {
                      const rowAvailableShares =
                        getTransferRowAvailableShares(
                          index
                        );
  
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-4"
                        >
                          <SelectInput
                            label="Company Share ID"
                            value={
                              item.share_id
                            }
                            options={rowAvailableShares.map(
                              (
                                share
                              ) => ({
                                value:
                                  share.company_share_id,
                                label: `${
                                  share.company_share_id ??
                                  '—'
                                } — Available: ${
                                  share.quantity ??
                                  0
                                }`,
                              })
                            )}
                            onChange={(
                              event
                            ) => {
                              const selected =
                                rowAvailableShares.find(
                                  (
                                    share
                                  ) =>
                                    String(
                                      share.company_share_id
                                    ) ===
                                    String(
                                      event
                                        .target
                                        .value
                                    )
                                );
  
                              setShareRequestItems(
                                (
                                  items
                                ) =>
                                  items.map(
                                    (
                                      row,
                                      rowIndex
                                    ) =>
                                      rowIndex ===
                                      index
                                        ? {
                                            ...row,
                                            share_id:
                                              event
                                                .target
                                                .value,
                                            shareholder_share_id:
                                              selected?.id
                                                ? String(
                                                    selected.id
                                                  )
                                                : '',
                                            quantity:
                                              selected?.quantity !=
                                              null
                                                ? String(
                                                    selected.quantity
                                                  )
                                                : '1',
                                            purchase_value:
                                              selected?.share_price !=
                                              null
                                                ? String(
                                                    selected.share_price
                                                  )
                                                : '',
                                          }
                                        : row
                                  )
                              );
                            }}
                          />
  
                          <Input
                            label="Quantity"
                            type="number"
                            value={
                              item.quantity
                            }
                            onChange={(
                              event
                            ) =>
                              updateTransferItem(
                                index,
                                'quantity',
                                event.target.value
                              )
                            }
                          />
  
                          <Input
                            label="Par Value"
                            type="number"
                            value={
                              item.purchase_value
                            }
                            disabled
                            onChange={() => {}}
                          />
  
                          <div className="flex items-end">
                            <button
                              className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-semibold text-red-600"
                              onClick={() =>
                                removeTransferItem(
                                  index
                                )
                              }
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
  
                <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
                  Selected Quantity:{' '}
                  <strong>
                    {getSelectedTransferQuantity()}
                  </strong>
                </div>
              </div>
            )}
  
            <div className="mt-5">
              <TextArea
                label="Note"
                value={
                  shareTransferNote
                }
                onChange={(event) =>
                  setShareTransferNote(
                    event.target.value
                  )
                }
              />
            </div>
  
            <div className="mt-5">
              <button
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                onClick={
                  submitShareTransferRequest
                }
              >
                Submit Request
              </button>
            </div>
          </div>
        )}
  
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h3 className="text-lg font-bold">
              Request List
            </h3>
  
            <p className="mt-1 text-sm text-slate-500">
              Review the complete share details before forwarding or approving a request.
            </p>
          </div>
  
          {visibleTransfers.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      Request Type
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      Applicant
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      From
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      To
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      Company Share ID
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      Share Value
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      Quantity
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      Date
                    </th>
  
                    <th className="px-4 py-3 text-left">
                      Status
                    </th>
  
                    {canReview && (
                      <th className="px-4 py-3 text-left">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
  
                <tbody className="divide-y divide-slate-100">
                  {visibleTransfers.map(
                    (
                      transfer,
                      index
                    ) => {
                      const applicantRow =
                        shareholders.find(
                          (item) =>
                            String(
                              item.id
                            ) ===
                            String(
                              transfer.applicant_shareholder_id
                            )
                        );
  
                      const fromRow =
                        shareholders.find(
                          (item) =>
                            String(
                              item.id
                            ) ===
                            String(
                              transfer.from_shareholder_id
                            )
                        );
  
                      const toRow =
                        shareholders.find(
                          (item) =>
                            String(
                              item.id
                            ) ===
                            String(
                              transfer.to_shareholder_id
                            )
                        );
  
                      const requestItems =
                        Array.isArray(
                          transfer
                            .request_items
                            ?.items
                        )
                          ? transfer
                              .request_items
                              .items
                          : [];
  
                      const transferShareDetails =
                        requestItems.filter(
                          (
                            item: any
                          ) =>
                            item?.share_id &&
                            !item?.withdrawal &&
                            !item?.closure
                        );
  
                        const companyShareIds = [
                          ...transferShareDetails
                            .map(
                              (item: any) =>
                                item.share_id
                            ),
                          ...(transfer.request_items?.items ?? [])
                            .flatMap(
                              (item: any) =>
                                (item.withdrawal || item.closure)
                                  ? (item.shares ?? []).map(
                                      (share: any) =>
                                        share.company_share_id
                                    )
                                  : []
                            ),
                        ]
                          .filter(
                            (value: any) =>
                              value !== null &&
                              value !== undefined &&
                              String(value).trim() !== ''
                          )
                          .join(', ');
  
                      const transferTotalValue =
                        transferShareDetails.reduce(
                          (
                            sum: number,
                            item: any
                          ) =>
                            sum +
                            Number(
                              item.purchase_value ??
                                (
                                  Number(
                                    item.quantity ??
                                      0
                                  ) *
                                  Number(
                                    item.share_price ??
                                      item.par_value ??
                                      0
                                  )
                                )
                            ),
                          0
                        );
  
                      const transferQuantity =
                        transferShareDetails.reduce(
                          (
                            sum: number,
                            item: any
                          ) =>
                            sum +
                            Number(
                              item.quantity ??
                                0
                            ),
                          0
                        );
  
                        const databaseStatus =
                        String(
                          transfer.status ?? 'pending'
                        )
                          .trim()
                          .toLowerCase();
                      
                      const verification =
                        transfer.request_items?.verification ??
                        {};
                      
                      const status =
                        databaseStatus === 'approved' ||
                        databaseStatus === 'rejected'
                          ? databaseStatus
                          : verification?.accountant_verified === true
                          ? 'accountant_verified'
                          : verification?.employee_rechecked === true
                          ? 'employee_rechecked'
                          : databaseStatus; 
  
                      return (
                        <tr
                          key={
                            transfer.id ??
                            `transfer-${index}`
                          }
                        >
                          <td className="px-4 py-3">
                            {transfer.request_type ??
                              '—'}
                          </td>
  
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              {applicantRow
                                ?.company_shareholder_id ??
                                transfer.applicant_shareholder_id ??
                                '—'}
                            </div>
  
                            <div className="text-xs text-slate-500">
                              {applicantRow
                                ?.full_name ??
                                '—'}
                            </div>
                          </td>
  
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              {fromRow
                                ?.full_name ??
                                '—'}
                            </div>
  
                            <div className="text-xs text-slate-500">
                              ID:{' '}
                              {fromRow
                                ?.company_shareholder_id ??
                                '—'}
                            </div>
                          </td>
  
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              {toRow
                                ?.full_name ??
                                '—'}
                            </div>
  
                            <div className="text-xs text-slate-500">
                              ID:{' '}
                              {toRow
                                ?.company_shareholder_id ??
                                '—'}
                            </div>
                          </td>
  
                          <td className="px-4 py-3">
                            {companyShareIds ||
                              '—'}
                          </td>
  
                          <td className="px-4 py-3 font-semibold">
                            {transferShareDetails.length >
                            0
                              ? formatMoney(
                                  transferTotalValue
                                )
                              : transfer.total_amount !=
                                null
                              ? formatMoney(
                                  Number(
                                    transfer.total_amount
                                  )
                                )
                              : '—'}
                          </td>
  
                          <td className="px-4 py-3">
                            {transferShareDetails.length >
                            0
                              ? transferQuantity.toLocaleString()
                              : Number(
                                  transfer.quantity ??
                                    0
                                ).toLocaleString()}
                          </td>
  
                          <td className="px-4 py-3">
                            {transfer.transfer_date ??
                              '—'}
                          </td>
  
                          <td className="px-4 py-3">
                            <span
                              className={
                                status ===
                                'approved'
                                  ? 'rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700'
                                  : status ===
                                    'rejected'
                                  ? 'rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700'
                                  : status ===
                                    'accountant_verified'
                                  ? 'rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700'
                                  : status ===
                                    'employee_rechecked'
                                  ? 'rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700'
                                  : 'rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700'
                              }
                            >
                              {status ===
                              'employee_rechecked'
                                ? 'Employee Re-checked'
                                : status ===
                                  'accountant_verified'
                                ? 'Accountant Verified'
                                : status ===
                                  'approved'
                                ? 'Approved'
                                : status ===
                                  'rejected'
                                ? 'Rejected'
                                : 'Pending'}
                            </span>
                          </td>
  
                          {canReview && (
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-2">
                                {status ===
                                  'pending' &&
                                  currentUserRole ===
                                    'Employee' && (
                                    <button
                                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                                      onClick={() =>
                                        updateTransferStatus(
                                          transfer,
                                          'employee_rechecked'
                                        )
                                      }
                                    >
                                      Re-check & Forward
                                    </button>
                                  )}
  
                                {status ===
                                  'employee_rechecked' &&
                                  currentUserRole ===
                                    'Accountant' && (
                                    <button
                                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                                      onClick={() =>
                                        updateTransferStatus(
                                          transfer,
                                          'accountant_verified'
                                        )
                                      }
                                    >
                                      Verify & Forward
                                    </button>
                                  )}
  
                                {status ===
                                  'accountant_verified' &&
                                  currentUserRole ===
                                    'Admin' && (
                                    <>
                                      {(
  rows.permissions ?? []
).some(
  (permission: any) =>
    String(permission.role ?? '')
      .trim()
      .toLowerCase() ===
      currentUserRole.toLowerCase() &&
    String(permission.module ?? '')
      .trim()
      .toLowerCase() ===
      'share-transfer' &&
    permission.can_approve === true
) && (
  <button
    className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
    onClick={() =>
      updateTransferStatus(
        transfer,
        'approved'
      )
    }
  >
    Approve
  </button>
)}
  
                                      <button
                                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                                        onClick={() =>
                                          updateTransferStatus(
                                            transfer,
                                            'rejected'
                                          )
                                        }
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
  
                                {status !==
                                  'pending' &&
                                  status !==
                                    'employee_rechecked' &&
                                  status !==
                                    'accountant_verified' &&
                                  status !==
                                    'approved' &&
                                  status !==
                                    'rejected' && (
                                    <span className="text-xs text-slate-400">
                                      Reviewed
                                    </span>
                                  )}
  
                                {status ===
                                  'approved' && (
                                  <span className="text-xs font-semibold text-green-600">
                                    Approved
                                  </span>
                                )}
  
                                {status ===
                                  'rejected' && (
                                  <span className="text-xs font-semibold text-red-600">
                                    Rejected
                                  </span>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderReports = () => {
    const totalShareholders =
      shareholders.length;

    const totalShares =
      shareholders.reduce(
        (sum, item) =>
          sum +
          Number(
            item.share_quantity ?? 0
          ),
        0
      );

    const totalValue =
      shareholders.reduce(
        (sum, item) =>
          sum +
          Number(
            item.total_share_value ?? 0
          ),
        0
      );

    const totalDeposited =
      shareholders.reduce(
        (sum, item) =>
          sum +
          Number(
            item.deposit_amount ?? 0
          ),
        0
      );

    const totalDue =
      shareholders.reduce(
        (sum, item) =>
          sum +
          Number(
            item.due_amount ?? 0
          ),
        0
      );

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            Reports
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current company share and financial summary.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Shareholders"
            value={totalShareholders}
            icon="👥"
          />

          <StatCard
            title="Allocated Shares"
            value={totalShares.toLocaleString()}
            icon="📊"
          />

          <StatCard
            title="Share Value"
            value={formatMoney(totalValue)}
            icon="💰"
          />

          <StatCard
            title="Deposited"
            value={formatMoney(totalDeposited)}
            icon="💳"
          />

          <StatCard
            title="Due"
            value={formatMoney(totalDue)}
            icon="⏳"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    Shareholder ID
                  </th>

                  <th className="px-4 py-3 text-left">
                    Name
                  </th>

                  <th className="px-4 py-3 text-left">
                    Shares
                  </th>

                  <th className="px-4 py-3 text-left">
                    Value
                  </th>

                  <th className="px-4 py-3 text-left">
                    Deposited
                  </th>

                  <th className="px-4 py-3 text-left">
                    Due
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {shareholders.map(
                  (item, index) => (
                    <tr
                      key={
                        item.id ??
                        `report-${index}`
                      }
                    >
                      <td className="px-4 py-3">
                        {item.company_shareholder_id ??
                          '—'}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {item.full_name ??
                          '—'}
                      </td>

                      <td className="px-4 py-3">
                        {Number(
                          item.share_quantity ??
                            0
                        ).toLocaleString()}
                      </td>

                      <td className="px-4 py-3">
                        {formatMoney(
                          item.total_share_value
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {formatMoney(
                          item.deposit_amount
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {formatMoney(
                          item.due_amount
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderInvestments = () => {
    const investmentRows =
      rows.investments ?? [];
  
    const isEditingInvestment =
      editing?.table === 'investments';
  
    const investmentForm =
      isEditingInvestment
        ? genericForm
        : genericForm;
  
    const updateInvestmentField = (
      key: string,
      value: any
    ) => {
      setGenericForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    };
  
    const startInvestmentEdit = (
      row: GenericRow
    ) => {
      setEditing({
        table: 'investments',
        row,
      });
  
      setGenericForm({
        investment_name:
          row.investment_name ?? '',
        investment_type:
          row.investment_type ?? '',
        investment_amount:
          row.investment_amount ?? '',
        investment_date:
          row.investment_date ??
          new Date()
            .toISOString()
            .slice(0, 10),
        project_id:
          row.project_id ?? '',
        expected_return:
          row.expected_return ?? 0,
        actual_return:
          row.actual_return ?? 0,
        status:
          row.status ?? 'active',
        notes:
          row.notes ?? '',
      });
  
      clearMessages();
    };
  
    const cancelInvestmentEdit = () => {
      setEditing(null);
      setGenericForm({});
      clearMessages();
    };
  
    const handleSaveInvestment = async () => {
      const investmentName =
        String(
          investmentForm.investment_name ??
            ''
        ).trim();
  
      const investmentAmount =
        Number(
          investmentForm.investment_amount
        );
  
      if (!investmentName) {
        setError(
          'Please enter an investment name.'
        );
        return;
      }
  
      if (
        !Number.isFinite(
          investmentAmount
        ) ||
        investmentAmount < 0
      ) {
        setError(
          'Investment amount must be zero or greater.'
        );
        return;
      }
  
      const projectIdText =
        String(
          investmentForm.project_id ??
            ''
        ).trim();
  
      const projectId =
        projectIdText
          ? Number(projectIdText)
          : null;
  
      if (
        projectId !== null &&
        (!Number.isInteger(projectId) ||
          projectId <= 0)
      ) {
        setError(
          'Project ID must be a valid number.'
        );
        return;
      }
  
      const expectedReturnText =
        String(
          investmentForm.expected_return ??
            ''
        ).trim();
  
      const actualReturnText =
        String(
          investmentForm.actual_return ??
            ''
        ).trim();
  
      const expectedReturn =
        expectedReturnText
          ? Number(expectedReturnText)
          : 0;
  
      const actualReturn =
        actualReturnText
          ? Number(actualReturnText)
          : 0;
  
      if (
        !Number.isFinite(
          expectedReturn
        ) ||
        expectedReturn < 0
      ) {
        setError(
          'Expected return must be zero or greater.'
        );
        return;
      }
  
      if (
        !Number.isFinite(
          actualReturn
        ) ||
        actualReturn < 0
      ) {
        setError(
          'Actual return must be zero or greater.'
        );
        return;
      }
  
      const payload: GenericRow = {
        investment_name:
          investmentName,
        investment_type:
          String(
            investmentForm.investment_type ??
              ''
          ).trim() || null,
        investment_amount:
          investmentAmount,
        investment_date:
          investmentForm.investment_date ||
          new Date()
            .toISOString()
            .slice(0, 10),
        project_id:
          projectId,
        expected_return:
          expectedReturn,
        actual_return:
          actualReturn,
        status:
          String(
            investmentForm.status ??
              'active'
          ).trim() ||
          'active',
        notes:
          String(
            investmentForm.notes ??
              ''
          ).trim() || null,
      };
  
      await saveGenericRow(
        'investments',
        payload
      );
    };
  
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            Investments
          </h2>
  
          <p className="mt-1 text-sm text-slate-500">
            Manage company investments and
            investment returns.
          </p>
        </div>
  
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isEditingInvestment
                  ? 'Edit Investment'
                  : 'Add Investment'}
              </h3>
  
              <p className="mt-1 text-sm text-slate-500">
                Record money invested by the
                company.
              </p>
            </div>
  
            {isEditingInvestment && (
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={
                  cancelInvestmentEdit
                }
              >
                Cancel
              </button>
            )}
          </div>
  
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Investment Name
              </label>
  
              <input
                type="text"
                value={
                  investmentForm.investment_name ??
                  ''
                }
                onChange={(event) =>
                  updateInvestmentField(
                    'investment_name',
                    event.target.value
                  )
                }
                placeholder="Example: Gazipur Project Investment"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
  
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Investment Type
              </label>
  
              <select
                value={
                  investmentForm.investment_type ??
                  ''
                }
                onChange={(event) =>
                  updateInvestmentField(
                    'investment_type',
                    event.target.value
                  )
                }
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="">
                  Select Type
                </option>
  
                <option value="Project">
                  Project
                </option>
  
                <option value="Property">
                  Property
                </option>
  
                <option value="Business">
                  Business
                </option>
  
                <option value="Other">
                  Other
                </option>
              </select>
            </div>
  
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Investment Amount
              </label>
  
              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  investmentForm.investment_amount ??
                  ''
                }
                onChange={(event) =>
                  updateInvestmentField(
                    'investment_amount',
                    event.target.value
                  )
                }
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
  
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Investment Date
              </label>
  
              <input
                type="date"
                value={
                  investmentForm.investment_date ??
                  ''
                }
                onChange={(event) =>
                  updateInvestmentField(
                    'investment_date',
                    event.target.value
                  )
                }
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
  
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Project ID
              </label>
  
              <input
                type="number"
                min="1"
                value={
                  investmentForm.project_id ??
                  ''
                }
                onChange={(event) =>
                  updateInvestmentField(
                    'project_id',
                    event.target.value
                  )
                }
                placeholder="Optional"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
  
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Expected Return
              </label>
  
              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  investmentForm.expected_return ??
                  0
                }
                onChange={(event) =>
                  updateInvestmentField(
                    'expected_return',
                    event.target.value
                  )
                }
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
  
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Actual Return
              </label>
  
              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  investmentForm.actual_return ??
                  0
                }
                onChange={(event) =>
                  updateInvestmentField(
                    'actual_return',
                    event.target.value
                  )
                }
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
  
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Status
              </label>
  
              <select
                value={
                  investmentForm.status ??
                  'active'
                }
                onChange={(event) =>
                  updateInvestmentField(
                    'status',
                    event.target.value
                  )
                }
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="active">
                  Active
                </option>
  
                <option value="completed">
                  Completed
                </option>
  
                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </div>
  
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Notes
              </label>
  
              <textarea
                value={
                  investmentForm.notes ??
                  ''
                }
                onChange={(event) =>
                  updateInvestmentField(
                    'notes',
                    event.target.value
                  )
                }
                rows={3}
                placeholder="Optional notes"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
  
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              onClick={
                handleSaveInvestment
              }
            >
              {isEditingInvestment
                ? 'Update Investment'
                : 'Save Investment'}
            </button>
          </div>
        </div>
  
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">
              Investment Records
            </h3>
          </div>
  
          {investmentRows.length ===
          0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No investment records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-4 py-3 font-semibold">
                      Investment
                    </th>
  
                    <th className="px-4 py-3 font-semibold">
                      Type
                    </th>
  
                    <th className="px-4 py-3 font-semibold">
                      Amount
                    </th>
  
                    <th className="px-4 py-3 font-semibold">
                      Date
                    </th>
  
                    <th className="px-4 py-3 font-semibold">
                      Expected Return
                    </th>
  
                    <th className="px-4 py-3 font-semibold">
                      Actual Return
                    </th>
  
                    <th className="px-4 py-3 font-semibold">
                      Status
                    </th>
  
                    <th className="px-4 py-3 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
  
                <tbody>
                  {investmentRows.map(
                    (row: GenericRow) => (
                      <tr
                        key={row.id}
                        className="border-b border-slate-100"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {row.investment_name ||
                            '—'}
                        </td>
  
                        <td className="px-4 py-3 text-slate-600">
                          {row.investment_type ||
                            '—'}
                        </td>
  
                        <td className="px-4 py-3 text-slate-600">
                          ৳
                          {Number(
                            row.investment_amount ??
                              0
                          ).toLocaleString(
                            'en-BD'
                          )}
                        </td>
  
                        <td className="px-4 py-3 text-slate-600">
                          {row.investment_date ||
                            '—'}
                        </td>
  
                        <td className="px-4 py-3 text-slate-600">
                          ৳
                          {Number(
                            row.expected_return ??
                              0
                          ).toLocaleString(
                            'en-BD'
                          )}
                        </td>
  
                        <td className="px-4 py-3 text-slate-600">
                          ৳
                          {Number(
                            row.actual_return ??
                              0
                          ).toLocaleString(
                            'en-BD'
                          )}
                        </td>
  
                        <td className="px-4 py-3">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {String(
                              row.status ??
                                ''
                            )
                              .charAt(0)
                              .toUpperCase() +
                              String(
                                row.status ??
                                  ''
                              ).slice(1)}
                          </span>
                        </td>
  
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                              onClick={() =>
                                startInvestmentEdit(
                                  row
                                )
                              }
                            >
                              Edit
                            </button>
  
                            <button
                              type="button"
                              className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                              onClick={() =>
                                deleteGenericRow(
                                  'investments',
                                  row
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAdministration = () => {
    const permissionRoles: RoleName[] = [
      'Admin',
      'Shareholder',
      'Employee',
      'Accountant',
      'Manager',
      'Visitor',
    ];
  
    const permissionModules: Array<{
      page: Page;
      title: string;
    }> = [
      { page: 'dashboard', title: 'Dashboard' },
      { page: 'shareholders', title: 'Shareholders' },
      { page: 'shares', title: 'Shares' },
      { page: 'shareholder-share', title: 'Shareholder Share' },
      { page: 'share-settings', title: 'Share Settings' },
      { page: 'share-transfer', title: 'Share Transfer' },
      {
        page: 'shareholder-documents',
        title: 'Shareholder Documents',
      },
      {
        page: 'shareholder-payments',
        title: 'Shareholder Payments',
      },
      {
        page: 'shareholder-dividends',
        title: 'Shareholder Dividends',
      },
      {
        page: 'my-share-details',
        title: 'My Share Details',
      },
      { page: 'investments', title: 'Investments' },
      { page: 'customers', title: 'Customers' },
      { page: 'projects', title: 'Projects' },
      { page: 'properties', title: 'Properties' },
      { page: 'booking', title: 'Booking' },
      { page: 'payments', title: 'Payments' },
      { page: 'dividend', title: 'Dividend' },
      { page: 'notices', title: 'Notices' },
      {
        page: 'company-policy',
        title: 'Company Policy',
      },
      { page: 'reports', title: 'Reports' },
    ];
  
    const updatePermission = async (
      role: RoleName,
      module: Page,
      field:
        | 'can_view'
        | 'can_create'
        | 'can_edit'
        | 'can_delete'
        | 'can_approve',
      value: boolean
    ) => {
      clearMessages();
  
      try {
        const roleValue = role.toLowerCase();
  
        const existingPermission = (
          rows.permissions ?? []
        ).find(
          (item: any) =>
            String(item.role ?? '')
              .trim()
              .toLowerCase() === roleValue &&
            String(item.module ?? '')
              .trim()
              .toLowerCase() === module.toLowerCase()
        );
  
        if (existingPermission?.id) {
          const { error } = await supabase
            .from('permissions')
            .update({
              [field]: value,
            })
            .eq('id', existingPermission.id);
  
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('permissions')
            .insert({
              role: roleValue,
              module,
              can_view:
                field === 'can_view' ? value : false,
              can_create:
                field === 'can_create' ? value : false,
              can_edit:
                field === 'can_edit' ? value : false,
              can_delete:
                field === 'can_delete' ? value : false,
              can_approve:
                field === 'can_approve' ? value : false,
            });
  
          if (error) throw error;
        }
  
        setMessage(
          `${role} → ${module} permission updated.`
        );
  
        await loadData(
          currentUserRole,
          currentUserId
        );
      } catch (err: any) {
        setError(
          err?.message ||
            'Unable to update permission.'
        );
      }
    };
    const updateUserRole = async (
      userId: number,
      newRole: RoleName
    ) => {
      clearMessages();
    
      try {
        const { error } = await supabase
          .from('user_roles')
          .update({
            role: newRole.toLowerCase(),
          })
          .eq('id', userId);
    
        if (error) throw error;
    
        setMessage(
          `User role updated to ${newRole}.`
        );
    
        await loadData(
          currentUserRole,
          currentUserId
        );
      } catch (err: any) {
        setError(
          err?.message ||
            'Unable to update user role.'
        );
      }
    };
    const updateUserActiveStatus = async (
      userId: number,
      isActive: boolean
    ) => {
      clearMessages();
    
      try {
        const { error } = await supabase
          .from('user_roles')
          .update({
            is_active: isActive,
          })
          .eq('id', userId);
    
        if (error) throw error;
    
        setMessage(
          isActive
            ? 'User activated successfully.'
            : 'User deactivated successfully.'
        );
    
        await loadData(
          currentUserRole,
          currentUserId
        );
      } catch (err: any) {
        setError(
          err?.message ||
            'Unable to update user status.'
        );
      }
    };
  
    const getPermission = (
      role: RoleName,
      module: Page
    ) => {
      return (rows.permissions ?? []).find(
        (item: any) =>
          String(item.role ?? '')
            .trim()
            .toLowerCase() ===
            role.toLowerCase() &&
          String(item.module ?? '')
            .trim()
            .toLowerCase() ===
            module.toLowerCase()
      );
    };
  
    const roleUsers = (rows.user_roles ?? []).filter(
      (user: any) =>
        String(user.role ?? '')
          .trim()
          .toLowerCase() !== 'admin'
    );
  
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            Administration
          </h2>
  
          <p className="mt-1 text-sm text-slate-500">
            Control menu and module permissions for
            each user role.
          </p>
        </div>
  
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <h3 className="text-lg font-bold">
              User Management
            </h3>
  
            <p className="mt-1 text-sm text-slate-500">
              Manage user roles for registered users.
            </p>
          </div>
  
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-white">
                  <th className="px-4 py-3 text-left font-semibold">
                    Email
                  </th>
  
                  <th className="px-4 py-3 text-left font-semibold">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
  Status
</th>

<th className="px-4 py-3 text-left font-semibold">
  Action
</th>
                </tr>
              </thead>
  
              <tbody>
                {roleUsers.map((user: any) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-4 py-3">
                      {user.email ||
                        'Email not available'}
                    </td>
  
                    <td className="px-4 py-3 font-medium">
  {String(user.role ?? '')
    .trim()
    .toLowerCase() === 'admin' ? (
    <span>Admin</span>
  ) : (
    <select
      value={normalizeRole(user.role)}
      onChange={(event) =>
        updateUserRole(
          Number(user.id),
          event.target.value as RoleName
        )
      }
      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm"
    >
      <option value="Shareholder">
        Shareholder
      </option>
      <option value="Employee">
        Employee
      </option>
      <option value="Accountant">
        Accountant
      </option>
      <option value="Manager">
        Manager
      </option>
      <option value="Visitor">
        Visitor
      </option>
    </select>
  )}
</td>
<td className="px-4 py-3">
  {user.is_active === false ? (
    <span className="font-semibold text-red-600">
      Inactive
    </span>
  ) : (
    <span className="font-semibold text-green-600">
      Active
    </span>
  )}
</td>

<td className="px-4 py-3">
  {String(user.role ?? '')
    .trim()
    .toLowerCase() !== 'admin' && (
      <button
  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold hover:bg-slate-200"
  onClick={() =>
    updateUserActiveStatus(
      Number(user.id),
      user.is_active === false
    )
  }
>
  {user.is_active === false
    ? 'Activate'
    : 'Deactivate'}
</button>
  )}
</td>
                  </tr>
                ))}
  
                {roleUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-6 text-center text-sm text-slate-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
  
        {permissionRoles.map((role) => (
          <div
            key={role}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <h3 className="text-lg font-bold">
                {role}
              </h3>
  
              <p className="mt-1 text-sm text-slate-500">
                Control what this role can access and
                do.
              </p>
            </div>
  
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-white">
                    <th className="px-4 py-3 text-left font-semibold">
                      Module
                    </th>
  
                    <th className="px-4 py-3 text-center font-semibold">
                      View
                    </th>
  
                    <th className="px-4 py-3 text-center font-semibold">
                      Create
                    </th>
  
                    <th className="px-4 py-3 text-center font-semibold">
                      Edit
                    </th>
  
                    <th className="px-4 py-3 text-center font-semibold">
                      Delete
                    </th>
  
                    <th className="px-4 py-3 text-center font-semibold">
                      Approve
                    </th>
                  </tr>
                </thead>
  
                <tbody>
                  {permissionModules.map((item) => {
                    const permission =
                      getPermission(
                        role,
                        item.page
                      );
  
                    return (
                      <tr
                        key={item.page}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <td className="px-4 py-3 font-medium">
                          {item.title}
                        </td>
  
                        {(
                          [
                            'can_view',
                            'can_create',
                            'can_edit',
                            'can_delete',
                            'can_approve',
                          ] as const
                        ).map((field) => (
                          <td
                            key={field}
                            className="px-4 py-3 text-center"
                          >
                            <input
                              type="checkbox"
                              checked={
                                permission?.[field] ===
                                true
                              }
                              onChange={(event) =>
                                updatePermission(
                                  role,
                                  item.page,
                                  field,
                                  event.target.checked
                                )
                              }
                              className="h-4 w-4 cursor-pointer"
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCurrentPage = () => {
    switch (page) {
      case 'dashboard':
        return renderDashboard();

      case 'shareholders':
        return renderShareholders();

      case 'shares':
        return renderShares();

      case 'shareholder-share':
        return renderShareholderShare();

      case 'share-settings':
        return renderShareSettings();

      case 'share-transfer':
        return renderShareTransfer();

      case 'my-share-details':
        return renderMyShareDetails();

      case 'investments':
        return renderInvestments();

      case 'reports':
        return renderReports();

      case 'administration':
        return renderAdministration();

      case 'customers':
        return renderGenericPage(
          genericConfigs.customers
        );

      case 'projects':
        return renderGenericPage(
          genericConfigs.project
        );

      case 'properties':
        return renderGenericPage(
          genericConfigs.properties
        );

      case 'booking':
        return renderGenericPage(
          genericConfigs.booking
        );

      case 'payments':
        return renderGenericPage(
          genericConfigs.payments
        );

      case 'dividend':
        return renderGenericPage(
          genericConfigs.dividend
        );

        case 'notices':
          return (
            <>
              {renderGenericPage(
                genericConfigs.notices
              )}
        
              {renderGenericPage(
                genericConfigs.notice_deliveries
              )}
            </>
          );

      case 'company-policy':
        return renderGenericPage(
          genericConfigs.company_policy
        );

      case 'shareholder-documents':
        return renderGenericPage({
          title: 'Shareholder Documents',
          table: 'shareholder_documents',
          fields: [
            {
              key: 'shareholder_id',
              label: 'Shareholder ID',
              type: 'number',
            },
            {
              key: 'title',
              label: 'Document Title',
              type: 'text',
            },
            {
              key: 'document_url',
              label: 'Document URL',
              type: 'text',
            },
          ],
        });

      case 'shareholder-payments':
        return renderGenericPage({
          title: 'Shareholder Payments',
          table: 'shareholder_payments',
          fields: [
            {
              key: 'shareholder_id',
              label: 'Shareholder ID',
              type: 'number',
            },
            {
              key: 'amount',
              label: 'Amount',
              type: 'number',
            },
            {
              key: 'payment_date',
              label: 'Payment Date',
              type: 'date',
            },
            {
              key: 'payment_method',
              label: 'Payment Method',
              type: 'text',
            },
            {
              key: 'reference_no',
              label: 'Reference',
              type: 'text',
            },
            {
              key: 'status',
              label: 'Status',
              type: 'text',
            },
          ],
        });

        case 'shareholder-dividends':
          return renderGenericPage({
            title: 'Shareholder Dividends',
            table: 'shareholder_dividends',
            fields: [
              {
                key: 'dividend_id',
                label: 'Dividend ID',
                type: 'number',
              },
              {
                key: 'shareholder_id',
                label: 'Shareholder ID',
                type: 'number',
              },
              {
                key: 'share_quantity',
                label: 'Share Quantity',
                type: 'number',
              },
              {
                key: 'dividend_amount',
                label: 'Dividend Amount',
                type: 'number',
              },
              {
                key: 'paid_amount',
                label: 'Paid Amount',
                type: 'number',
              },
              {
                key: 'due_amount',
                label: 'Due Amount',
                type: 'number',
              },
              {
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  {
                    value: 'pending',
                    label: 'Pending',
                  },
                  {
                    value: 'paid',
                    label: 'Paid',
                  },
                ],
              },
              {
                key: 'notes',
                label: 'Notes',
                type: 'textarea',
              },
            ],
          });

      default:
        return renderDashboard();
    }
  };

  if (authLoading) {
    return (
      <>
        <GlobalStyles />

        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 font-semibold">
              Loading...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <GlobalStyles />
  
        <style>
          {`
            .login-page {
              min-height: 100vh;
              width: 100%;
              position: relative;
              overflow: hidden;
              background: #dbeafe;
            }
  
            .login-hero-background {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: contain;
              object-position: center;
            }
  
            .login-overlay {
              position: absolute;
              inset: 0;
              background: linear-gradient(
                90deg,
                rgba(15, 23, 42, 0.02) 0%,
                rgba(15, 23, 42, 0.06) 55%,
                rgba(15, 23, 42, 0.18) 100%
              );
            }
  
            .login-card-wrapper {
              position: relative;
              z-index: 2;
              min-height: 100vh;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              padding: 60px 2.5% 100px;
              box-sizing: border-box;
            }
  
            .login-card {
              width: 100%;
              max-width: 235px;
              box-sizing: border-box;
              padding: 6px 15px;
              border-radius: 16px;
              background: rgba(255, 255, 255, 0.96);
              border: 1px solid rgba(255, 255, 255, 0.9);
              box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
              backdrop-filter: blur(10px);
            }
  
            .login-card-title {
              margin: 0;
              font-size: 22px;
              line-height: 1.15;
              font-weight: 800;
              color: #0f172a;
            }
  
            .login-card-subtitle {
              margin: 5px 0 0;
              font-size: 11px;
              line-height: 1.35;
              color: #64748b;
            }
  
            .login-field {
              margin-top: 6px;
            }
  
            .login-label {
              display: block;
              margin-bottom: 5px;
              font-size: 11px;
              font-weight: 700;
              color: #1e40af;
            }
  
            .login-input {
              width: 100%;
              box-sizing: border-box;
              padding: 9px 10px;
              border-radius: 8px;
              border: 1px solid #bfdbfe;
              background: #f8fbff;
              color: #0f172a;
              font-size: 11px;
              outline: none;
            }
  
            .login-input:focus {
              border-color: #2563eb;
              background: #ffffff;
              box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.10);
            }
  
            .login-signin {
              width: 100%;
              box-sizing: border-box;
              margin-top: 7px;
              border: none;
              border-radius: 8px;
              padding: 6px 10px;
              background: linear-gradient(90deg, #1d4ed8, #2563eb);
              color: #ffffff;
              font-size: 12px;
              font-weight: 700;
              cursor: pointer;
              box-shadow: 0 6px 14px rgba(37, 99, 235, 0.18);
            }
  
            .login-divider {
              display: flex;
              align-items: center;
              gap: 7px;
              margin: 6px 0;
            }
  
            .login-divider-line {
              flex: 1;
              height: 1px;
              background: #e2e8f0;
            }
  
            .login-divider-text {
              font-size: 9px;
              font-weight: 700;
              color: #94a3b8;
            }
  
            .login-google {
              width: 100%;
              border: 1px solid #bfdbfe;
              border-radius: 8px;
              padding: 9px 12px;
              background: #ffffff;
              color: #1d4ed8;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
            }
  
            .login-footer {
              margin-top: 12px;
              text-align: center;
            }
  
            .login-footer-text {
              margin: 0;
              font-size: 9px;
              color: #94a3b8;
            }
  
            .login-footer-company {
              margin: 5px 0 0;
              font-size: 9px;
              font-weight: 600;
              color: #64748b;
            }
  
            @media (max-width: 900px) {
              .login-card-wrapper {
                justify-content: center;
                align-items: center;
                padding: 30px 20px;
                background: rgba(15, 23, 42, 0.10);
              }
  
              .login-card {
                max-width: 300px;
              }
            }
  
            @media (max-width: 480px) {
              .login-card-wrapper {
                padding: 20px 14px;
              }
  
              .login-card {
                max-width: 290px;
                padding: 18px;
                border-radius: 16px;
              }
  
              .login-card-title {
                font-size: 21px;
              }
            }
          `}
        </style>
  
        <div className="login-page">
  
          {/* FULL HERO IMAGE */}
          <img
            src={heroImage}
            alt="Our Real Estate Company Ltd."
            className="login-hero-background"
          />
  
          {/* SOFT OVERLAY */}
          <div className="login-overlay" />
  
          {/* LOGIN CARD */}
          <div className="login-card-wrapper">
            <div className="login-card">
  
              {/* WELCOME */}
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    color: '#2563eb',
                  }}
                >
                  Secure Access
                </p>
  
                <h2 className="login-card-title">
                  Welcome Back
                </h2>
  
                <p className="login-card-subtitle">
                  Sign in to continue to your account
                </p>
              </div>
  
              {/* LOGIN ERROR */}
              {loginError && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '8px 9px',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                    background: '#fef2f2',
                    color: '#b91c1c',
                    fontSize: '10px',
                    fontWeight: 600,
                  }}
                >
                  {loginError}
                </div>
              )}
  
              {/* LOGIN FORM */}
              <form onSubmit={login}>
  
                {/* EMAIL */}
                <div className="login-field">
                  <label
                    htmlFor="login-email"
                    className="login-label"
                  >
                    Email
                  </label>
  
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginEmail}
                    placeholder="Enter your email address"
                    onChange={(event) =>
                      setLoginEmail(event.target.value)
                    }
                    className="login-input"
                  />
                </div>
  
                {/* PASSWORD */}
                <div className="login-field">
                  <label
                    htmlFor="login-password"
                    className="login-label"
                  >
                    Password
                  </label>
  
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={loginPassword}
                    placeholder="Enter your password"
                    onChange={(event) =>
                      setLoginPassword(event.target.value)
                    }
                    className="login-input"
                  />
                </div>
  
                {/* SIGN IN */}
                <button
                  type="submit"
                  className="login-signin"
                >
                  Sign In
                  <span style={{ marginLeft: '5px' }}>
                    →
                  </span>
                </button>
  
              </form>
  
              {/* DIVIDER */}
              <div className="login-divider">
                <div className="login-divider-line" />
  
                <span className="login-divider-text">
                  OR
                </span>
  
                <div className="login-divider-line" />
              </div>
  
              {/* GOOGLE LOGIN */}
              <button
                type="button"
                onClick={loginWithGoogle}
                className="login-google"
              >
                Continue with Google
              </button>
  
              {/* FOOTER */}
              <div className="login-footer">
                <p className="login-footer-text">
                  🛡 Secure Shareholder Management Portal
                </p>
  
                <p className="login-footer-company">
                  Our Real Estate Company Ltd.
                </p>
              </div>
  
            </div>
          </div>
  
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />

      <div className="min-h-screen bg-slate-100">
      <div
  style={{
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
  }}
>
<aside
  style={{
    display: 'flex',
    flexDirection: 'column',
    width: '260px',
    minWidth: '260px',
    minHeight: '100vh',
    flexShrink: 0,
    background: '#0756d6',
    color: '#ffffff',
  }}
>
<div
  style={{
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    padding: '18px 12px',
  }}
>
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}
  >
    <div
  style={{
    display: 'flex',
    width: '42px',
    height: '42px',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: '10px',
    background: '#ffffff',
  }}
>
  <img
    src={companyLogo}
    alt="Our Real Estate Company Ltd"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
  />
</div>

    <div
      style={{
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: '18px',
          lineHeight: '1.15',
          fontWeight: 800,
          color: '#ffffff',
          whiteSpace: 'nowrap',
        }}
      >
        Our Real Estate
      </div>

      <div
        style={{
          marginTop: '3px',
          fontSize: '15px',
          lineHeight: '1.2',
          fontWeight: 700,
          color: '#dbeafe',
          whiteSpace: 'nowrap',
        }}
      >
        Company Ltd
      </div>
    </div>
  </div>
</div>

            <div className="scrollbar-thin flex-1 overflow-y-auto p-3">
              <button
                className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  page === 'dashboard'
                    ? 'bg-white text-blue-700'
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() =>
                  navigate('dashboard')
                }
              >
                <span>🏠</span>
                Dashboard
              </button>

              {visibleMenuSections.map(
                (section) => (
                  <div
                    key={section.title}
                    className="mt-4"
                  >
                    <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-blue-100">
                      {section.title}
                    </p>

                    <div className="space-y-1">
                      {section.items.map(
                        (item) => (
                          <button
                            key={item.page}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                              page ===
                              item.page
                                ? 'bg-white text-blue-700'
                                : 'text-white hover:bg-white/10'
                            }`}
                            onClick={() =>
                              navigate(
                                item.page
                              )
                            }
                          >
                            <span>
                              {item.icon}
                            </span>

                            <span>
                              {item.label}
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="border-t border-white/15 p-4">
              <div className="mb-3 rounded-xl bg-white/10 p-3">
                <p className="truncate text-xs text-blue-100">
                  {session.user.email}
                </p>

                <p className="mt-1 text-sm font-bold">
                  {currentUserRole}
                </p>
              </div>

              <button
                className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/20"
                onClick={logout}
              >
                Sign Out
              </button>
            </div>
          </aside>

          <div
  style={{
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
  }}
>
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    className="rounded-xl border border-slate-200 p-2 lg:hidden"
                    onClick={() =>
                      setMobileMenuOpen(
                        (value) => !value
                      )
                    }
                  >
                    ☰
                  </button>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      {getPageTitle(page)}
                    </h2>

                    <p className="hidden text-xs text-slate-500 sm:block">
                      Our Real Estate Company Ltd
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {loadingData && (
                    <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-600" />
                      Syncing
                    </div>
                  )}

                  <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                    {currentUserRole}
                  </div>
                </div>
              </div>

              {mobileMenuOpen && (
                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg lg:hidden">
                  

                  <button
                    className="mt-3 w-full rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600"
                    onClick={logout}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </header>

            <main className="flex-1 p-4 lg:p-6">
              {message && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {renderCurrentPage()}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
  