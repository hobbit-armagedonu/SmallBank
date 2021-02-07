INSERT INTO IndividualStatus (code, status_name, status_description) VALUES 
('PEN', 'pending_activation', 'new user that just got created'),
('REQ', 'onboarding_requested', 'activation requested'),
('ONB', 'onboarding_data_provided', 'onboarding data acquired, pending approval'),
('ACT', 'activated', 'fully activated'),
('BLK', 'blocked', 'user verified negatively by the KYC team');