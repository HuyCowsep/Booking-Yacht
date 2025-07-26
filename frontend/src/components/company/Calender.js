import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  createCompanyCalendarSchedule,
  deleteCompanyCalendarSchedule,
  getCompanyCalendarSchedules,
  getYachtByIdCompany,
  updateCompanyCalendarSchedule
} from '../../services/ApiServices';

export default function MyCalendar() {
  const idCompany = useSelector(state => state.account.account.idCompany);
  const [yachts, setYachts] = useState([]);
  const [selectedYacht, setSelectedYacht] = useState('');
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [eventData, setEventData] = useState({
    id: '',
    title: '',
    description: '',
    start: '',
    end: '',
    yachtId: '',
    type: '',
    color: '#3788d8',
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState('timeGridWeek'); // default week

  const handleViewChange = useCallback((arg) => {
    setCurrentView(arg.view.type);
  }, []);

  // Lấy danh sách thuyền của company
  useEffect(() => {
    if (idCompany) {
      getYachtByIdCompany(idCompany).then(res => {
        if (res && res.data) {
          setYachts(res.data);
          // Không setSelectedYacht về thuyền đầu tiên, giữ mặc định là '' (tất cả)
        }
      });
    }
  }, [idCompany]);

  // Lấy lịch khi chọn thuyền
  useEffect(() => {
    fetchEvents(selectedYacht);
  }, [selectedYacht]);

  // Lấy lịch từ API
  const fetchEvents = async (yachtId) => {
    try {
      const res = await getCompanyCalendarSchedules(yachtId || undefined);
      console.log('API response:', res); // LOG 1
      if (res && res.data) {
        const mappedEvents = res.data.map(ev => {
          const start = new Date(ev.startDate);
          const end = new Date(ev.endDate);
          const now = new Date();
          const isAllDay =
            start.getHours() === 0 && start.getMinutes() === 0 &&
            end.getHours() === 0 && end.getMinutes() === 0 &&
            start.toDateString() === end.toDateString();
          const isPast = end < now;
          return {
            id: ev._id,
            title: ev.title,
            start: ev.startDate,
            // Không truyền end để event chỉ hiển thị ở thời điểm bắt đầu
            color: isPast ? '#00bfff' : (ev.color || '#ff9900'),
            description: ev.description,
            yachtId: ev.yachtId,
            status: ev.status,
            createdBy: ev.createdBy,
            yachtName: ev.yachtName,
            allDay: isAllDay,
            endDate: ev.endDate, // giữ để xem chi tiết
          };
        });
        console.log('Mapped events:', mappedEvents); // LOG 2
        setRawEvents(mappedEvents); // Lưu rawEvents từ API
        setEvents(mappedEvents); // Mapping lại cho FullCalendar
      }
    } catch (e) {
      setEvents([]);
      console.log('Fetch events error:', e); // LOG 3
    }
  };

  // Xử lý chọn ngày để tạo event
  const handleDateSelect = (selectInfo) => {
    setModalMode('create');
    setEventData({
      id: '',
      title: '',
      description: '',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      yachtId: selectedYacht || (yachts[0]?._id || ''),
      type: '',
      color: '#3788d8',
    });
    setShowModal(true);
  };

  // Xử lý click event: xem/sửa/xóa
  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setModalMode('edit'); // Always edit for now
    setEventData({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      yachtId: clickInfo.event.extendedProps.yachtId,
      type: clickInfo.event.extendedProps.type,
      color: clickInfo.event.backgroundColor,
    });
    setShowModal(true);
  };

  const validateEvent = (data) => {
    const now = new Date();
    if (!data.title || !data.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề!');
      return false;
    }
    if (!data.yachtId) {
      toast.error('Vui lòng chọn thuyền!');
      return false;
    }
    if (!data.start) {
      toast.error('Vui lòng chọn thời gian bắt đầu!');
      return false;
    }
    if (!data.end) {
      toast.error('Vui lòng chọn thời gian kết thúc!');
      return false;
    }
    if (new Date(data.start) < now.setHours(0,0,0,0)) {
      toast.error('Thời gian bắt đầu không được nhỏ hơn ngày hiện tại!');
      return false;
    }
    if (new Date(data.end) < now.setHours(0,0,0,0)) {
      toast.error('Thời gian kết thúc không được nhỏ hơn ngày hiện tại!');
      return false;
    }
    if (new Date(data.start) >= new Date(data.end)) {
      toast.error('Thời gian bắt đầu phải trước thời gian kết thúc!');
      return false;
    }
    return true;
  };

  const handleCreateEvent = async () => {
    if (!validateEvent(eventData)) return;
    try {
      const body = {
        yachtId: eventData.yachtId,
        title: eventData.title,
        description: eventData.description,
        startDate: eventData.start,
        endDate: eventData.end,
        color: '#ff9900', // luôn truyền màu cam
      };
      await createCompanyCalendarSchedule(body);
      toast.success('Tạo lịch thành công!');
      setShowModal(false);
      fetchEvents(selectedYacht);
    } catch (e) {
      toast.error('Tạo lịch thất bại!');
    }
  };

  const handleUpdateEvent = async () => {
    if (!validateEvent(eventData)) return;
    try {
      const body = {
        title: eventData.title,
        description: eventData.description,
        startDate: eventData.start,
        endDate: eventData.end,
        color: eventData.color,
      };
      await updateCompanyCalendarSchedule(eventData.id, body);
      toast.success('Cập nhật lịch thành công!');
      setShowModal(false);
      fetchEvents(selectedYacht);
    } catch (e) {
      toast.error('Cập nhật lịch thất bại!');
    }
  };

  // Xóa event
  const handleDeleteEvent = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa sự kiện này?')) return;
    try {
      await deleteCompanyCalendarSchedule(eventData.id);
      setShowModal(false);
      fetchEvents(selectedYacht);
    } catch (e) {}
  };

  // Trong renderModal/footer, disable Lưu/Xóa nếu event đã qua (end < hôm nay)
  const isPastEvent = (() => {
    const now = new Date();
    // Ưu tiên endDate, nếu không có thì dùng startDate
    const end = eventData.endDate || eventData.end || eventData.start;
    return end && new Date(end) < now.setHours(0,0,0,0);
  })();

  // Modal nhập/sửa event
  const renderModal = () => (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {modalMode === 'create' ? 'Tạo sự kiện mới' : modalMode === 'edit' ? 'Sửa sự kiện' : 'Chi tiết sự kiện'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Tiêu đề</Form.Label>
            <Form.Control
              type="text"
              value={eventData.title}
              disabled={modalMode === 'view'}
              onChange={e => setEventData({ ...eventData, title: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={eventData.description}
              disabled={modalMode === 'view'}
              onChange={e => setEventData({ ...eventData, description: e.target.value })}
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label>Bắt đầu</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={eventData.start?.slice(0, 16)}
                  disabled={modalMode === 'view'}
                  onChange={e => setEventData({ ...eventData, start: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label>Kết thúc</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={eventData.end?.slice(0, 16)}
                  disabled={modalMode === 'view'}
                  onChange={e => setEventData({ ...eventData, end: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-2">
            <Form.Label>Thuyền</Form.Label>
            <Form.Select
              value={eventData.yachtId}
              disabled={modalMode === 'view'}
              onChange={e => setEventData({ ...eventData, yachtId: e.target.value })}
            >
              {yachts.length === 0 ? (
                <option value="">Không có thuyền</option>
              ) : (
                yachts.map(y => (
                  <option key={y._id} value={y._id}>{y.name}</option>
                ))
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Màu sắc</Form.Label>
            <Form.Control
              type="color"
              value={eventData.color}
              disabled={modalMode === 'view'}
              onChange={e => setEventData({ ...eventData, color: e.target.value })}
              style={{ width: 60, height: 40 }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {modalMode === 'create' && (
          <Button variant="primary" onClick={handleCreateEvent}>Tạo</Button>
        )}
        {modalMode === 'edit' && (
          <>
            <Button variant="success" onClick={handleUpdateEvent} disabled={isPastEvent}>Lưu</Button>
            <Button variant="danger" onClick={handleDeleteEvent} disabled={isPastEvent}>Xóa</Button>
            {isPastEvent && <span style={{color: 'red', marginLeft: 8}}>Không thể thao tác với lịch đã qua</span>}
          </>
        )}
        <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );

  // Mapping event theo view
  const getMappedEvents = () => {
    if (currentView === 'dayGridMonth') {
      // Mapping cho month: chỉ truyền start, không end, màu cam hoặc xanh
      return rawEvents.map(ev => ({
        ...ev,
        end: undefined,
        color: ev.color,
      }));
    }
    if (currentView === 'timeGridWeek') {
      // Mapping cho week: chỉ truyền start, không truyền end
      return rawEvents.map(ev => ({
        ...ev,
        end: undefined,
        color: ev.color,
      }));
    }
    if (currentView === 'timeGridDay') {
      // Mapping cho day: truyền start, end nếu muốn block kéo dài, màu cam hoặc xanh
      return rawEvents.map(ev => ({
        ...ev,
        end: ev.endDate,
        color: ev.color,
      }));
    }
    if (currentView === 'listWeek') {
      // Mapping cho list: truyền start, end, màu cam hoặc xanh
      return rawEvents.map(ev => ({
        ...ev,
        end: ev.endDate,
        color: ev.color,
      }));
    }
    return rawEvents;
  };

  // Lưu rawEvents từ API, không mapping trực tiếp vào events state
  const [rawEvents, setRawEvents] = useState([]);

  // Trước khi render FullCalendar
  console.log('Events state before render:', events); // LOG 4
  return (
    <div>
      <div className="mb-3 d-flex align-items-center" style={{ gap: 16 }}>
        <span>Lọc theo thuyền:</span>
        <Form.Select
          style={{ width: 220 }}
          value={selectedYacht}
          onChange={e => setSelectedYacht(e.target.value)}
          disabled={yachts.length === 0}
        >
          <option value="">Tất cả thuyền</option>
          {yachts.length === 0 ? (
            <option value="" disabled>Không có thuyền</option>
          ) : (
            yachts.map(y => (
              <option key={y._id} value={y._id}>{y.name}</option>
            ))
          )}
        </Form.Select>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        selectable={true}
        editable={true}
        events={getMappedEvents()}
        select={handleDateSelect}
        eventClick={handleEventClick}
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        eventContent={eventInfo => renderEventContent(eventInfo, currentView)}
        initialDate={new Date()}
        datesSet={handleViewChange}
        eventDidMount={info => {
          const start = info.event.start
            ? info.event.start.toLocaleString('vi-VN')
            : '';
          const end = info.event.end
            ? info.event.end.toLocaleString('vi-VN')
            : '';
          const yachtName = info.event.extendedProps.yachtName || '';
          const type = info.event.extendedProps.type || '';
          const description = info.event.extendedProps.description || '';
          info.el.title =
            `Tiêu đề: ${info.event.title}\n` +
            (yachtName ? `Thuyền: ${yachtName}\n` : '') +
            (type ? `Loại: ${type}\n` : '') +
            (description ? `Mô tả: ${description}\n` : '') +
            `Bắt đầu: ${start}\nKết thúc: ${end}`;
        }}
      />
      {renderModal()}
    </div>
  );
}

function renderEventContent(eventInfo, currentView) {
  const start = eventInfo.event.start
    ? eventInfo.event.start.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
    : '';
  return (
    <div style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxHeight: 60, overflow: 'hidden', color: '#000' }}>
      <div style={{ fontWeight: 600 }}>{start} - {eventInfo.event.title}</div>
      {eventInfo.event.extendedProps.description && (
        <div style={{ fontSize: 11 }}>{eventInfo.event.extendedProps.description}</div>
      )}
      {/* Hiển thị tên thuyền nếu đang ở chế độ tất cả thuyền */}
      {/* selectedYacht === '' && eventInfo.event.extendedProps.yachtName && ( */}
      {/*   <div style={{ fontSize: 11 }}>Thuyền: {eventInfo.event.extendedProps.yachtName}</div> */}
      {/* ) */}
    </div>
  );
}
